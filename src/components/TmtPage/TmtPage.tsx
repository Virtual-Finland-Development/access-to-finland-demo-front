import React, {
  useState,
  useCallback,
  useEffect,
  FormEvent,
  ChangeEvent,
} from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Select,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// types
import { PlaceType, PlaceSelection, JobPostingsRequestPayload } from './types';

// components
import JobPostingItem from './JobPostingItem';
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadMore from '../LoadMore/LoadMore';

// hooks
import useJobPostings from './hooks/useJobPostings';

// selections
import regions from './regionJsons/regions.json';
import municipalities from './regionJsons/municipalities.json';

// utility component to render selection options (region, municipality, country)
const mapSelectOptions = (
  type: PlaceType,
  items: PlaceSelection[],
  placesInState: PlaceSelection[]
) => (
  <>
    {items.map((item: PlaceSelection) => (
      <option
        key={item.Koodi}
        value={JSON.stringify({ ...item, type })}
        disabled={Boolean(placesInState.find(p => p.Koodi === item.Koodi))}
      >
        {item.Selitteet.find(s => s.Kielikoodi === 'en')?.Teksti || ''}
      </option>
    ))}
  </>
);

export default function TmtPage() {
  const { userProfile } = useAppContext();

  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [search, setSearch] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceSelection[] | null>(
    null
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  const [payload, setPayload] = useState<JobPostingsRequestPayload | null>(
    null
  );

  /**
   * Set default search keys from userProfile, if provided.
   */
  useEffect(() => {
    if (userProfile?.id && userProfile.jobTitles?.length) {
      setSearchInputValue(userProfile.jobTitles.join(' '));
      setSearch(userProfile.jobTitles.join(' '));
    }
  }, [userProfile]);

  /**
   * Set default selected places for filtering, if provided in userProfile.
   */
  useEffect(() => {
    if (userProfile?.id && userProfile.regions?.length) {
      // merge region and municipality selections, map each and set type
      const selections: PlaceSelection[] = [
        ...regions.map(r => ({ ...r, type: PlaceType.REGION })),
        ...municipalities.map(m => ({ ...m, type: PlaceType.MUNICIPALITY })),
      ];
      // reduce userProfile regions, find matches and set to selected places
      const values: PlaceSelection[] = userProfile.regions.reduce(
        (acc: PlaceSelection[], code: string) => {
          const selected = selections.find(s => s.Koodi === code);
          if (selected) acc.push(selected);
          return acc;
        },
        []
      );

      setSelectedPlaces(values);
    }
  }, [userProfile]);

  /**
   * useJobPostings hook
   */
  const {
    data: jobPostings,
    isLoading: jobPostingsLoading,
    isFetching: jobPostingsFetching,
    error: jobPostingsError,
    refetch: fetchJobPostings,
    fetchNextPage,
    hasNextPage,
  } = useJobPostings(payload);

  /**
   * Track search / selectedPlaces state and construct payload
   */
  useEffect(() => {
    if (typeof search === 'string' || selectedPlaces) {
      const payload = {
        query: typeof search === 'string' ? search.split(' ').toString() : '',
        location: {
          regions: selectedPlaces
            ? selectedPlaces
                .filter(p => p.type === PlaceType.REGION)
                .map(p => p.Koodi)
            : [],
          municipalities: selectedPlaces
            ? selectedPlaces
                .filter(p => p.type === PlaceType.MUNICIPALITY)
                .map(p => p.Koodi)
            : [],
          countries: selectedPlaces
            ? selectedPlaces
                .filter(p => p.type === PlaceType.COUNTRY)
                .map(p => p.Koodi)
            : [],
        },
        paging: {
          itemsPerPage: itemsPerPage,
        },
      };

      setPayload(payload);
    }
  }, [itemsPerPage, search, selectedPlaces]);

  /**
   * Track payload state and fetch jobPostings on change
   */
  useEffect(() => {
    if (payload) {
      fetchJobPostings();
    }
  }, [fetchJobPostings, payload]);

  /**
   * Handle form submit (search input value)
   */
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setSearch(searchInputValue);
    },
    [searchInputValue]
  );

  return (
    <>
      <Flex bg="white" flexDirection="column" shadow="lg" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Flex flexDirection="column" px={3} pt={6}>
            <Heading as="h2" size="md">
              Vacancies
            </Heading>
          </Flex>
          <Stack
            direction={['column', 'row', 'row']}
            py={4}
            px={3}
            spacing={6}
            alignItems={{ md: 'end' }}
          >
            <FormControl w={{ base: 'auto', md: 'md' }}>
              <FormLabel>Word search</FormLabel>
              <Input
                placeholder="Search..."
                _placeholder={{ color: 'gray.500' }}
                defaultValue={search || ''}
                onChange={({ target }) => setSearchInputValue(target.value)}
                type="text"
              />
            </FormControl>
            <FormControl w="auto">
              <FormLabel>Location</FormLabel>
              <Select
                value="placeholder"
                onChange={({ target }) =>
                  setSelectedPlaces(prev => {
                    let places = prev || [];
                    return [...places, JSON.parse(target.value)];
                  })
                }
              >
                <option disabled value="placeholder">
                  Select location...
                </option>
                <optgroup label="Region">
                  {mapSelectOptions(
                    PlaceType.REGION,
                    regions,
                    selectedPlaces || []
                  )}
                </optgroup>
                <optgroup label="Municipality">
                  {mapSelectOptions(
                    PlaceType.MUNICIPALITY,
                    municipalities,
                    selectedPlaces || []
                  )}
                </optgroup>
              </Select>
            </FormControl>
            <FormControl w="auto">
              <FormLabel>Results per page</FormLabel>
              <Select
                w={40}
                bg="white"
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setItemsPerPage(Number(event.target.value))
                }
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              colorScheme="green"
              isDisabled={jobPostingsFetching}
            >
              Show jobs
            </Button>
          </Stack>
        </form>
      </Flex>

      {selectedPlaces && selectedPlaces.length > 0 && (
        <Flex flexDirection={'row'} flexWrap="wrap" mt={4} gap={3}>
          {selectedPlaces.map(place => (
            <Tag
              key={place.Koodi}
              size="lg"
              variant="outline"
              colorScheme="teal"
              bg="white"
            >
              <TagLabel fontSize="sm">
                {place.Selitteet.find(s => s.Kielikoodi === 'en')?.Teksti ||
                  place.Koodi}
              </TagLabel>
              <TagCloseButton
                onClick={() =>
                  setSelectedPlaces(prev => {
                    const places = prev || [];
                    return places.filter(p => p.Koodi !== place.Koodi);
                  })
                }
              />
            </Tag>
          ))}

          <Flex alignItems={'center'}>
            <Button
              rightIcon={<CloseIcon w={2.5} h="auto" />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => setSelectedPlaces([])}
            >
              Clear all
            </Button>
          </Flex>
        </Flex>
      )}

      {jobPostingsLoading && jobPostingsFetching && (
        <Stack mt={6}>
          <Loading />
        </Stack>
      )}

      {jobPostingsError && (
        <Flex alignItems="center" justifyContent="center" mt={6}>
          <Stack w="full" maxW="md">
            <ErrorMessage error={jobPostingsError} />
          </Stack>
        </Flex>
      )}

      {jobPostings?.pages && (
        <div style={{ position: 'relative' }}>
          {jobPostingsFetching && <Loading asOverlay />}

          {jobPostings.pages.length > 0 && (
            <>
              <SimpleGrid columns={1} spacing={5} mt={6} mb={6}>
                {jobPostings.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.results.map(item => (
                      <JobPostingItem key={item.id} item={item} />
                    ))}
                  </React.Fragment>
                ))}
              </SimpleGrid>

              <LoadMore
                isLoading={jobPostingsFetching}
                isDisabled={!hasNextPage}
                handleClick={() => fetchNextPage()}
              />

              {!jobPostingsFetching && !hasNextPage && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  mb={8}
                  border={1}
                >
                  <Stack w="full" maxW="md" textAlign="center">
                    <Text fontSize="xl" fontWeight="semibold" color="blue.400">
                      All results loaded!
                    </Text>
                  </Stack>
                </Flex>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
