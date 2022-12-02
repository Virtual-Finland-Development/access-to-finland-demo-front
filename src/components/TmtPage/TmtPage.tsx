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
import usePrevious from './hooks/usePrevious';
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
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceSelection[]>([]);
  /* const [paginationState, setPaginationState] = useState<{
    offset: number;
    limit: number;
  }>({
    offset: 0,
    limit: 10,
  }); */
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [payload, setPayload] = useState<JobPostingsRequestPayload | null>(
    null
  );

  /**
   * Set default search keys from userProfile, if provided.
   */
  useEffect(() => {
    if (userProfile?.id) {
      if (userProfile.jobTitles?.length) {
        setSearchInputValue(userProfile.jobTitles.join(' '));
        setSearch(userProfile.jobTitles.join(' '));
      }
    }
  }, [userProfile]);

  /**
   * Set default selected places for filtering, if provided in userProfile.
   */
  useEffect(() => {
    if (userProfile?.id) {
      const selections: PlaceSelection[] = [...regions, ...municipalities];
      let values: PlaceSelection[] = [];

      if (userProfile.regions?.length) {
        values = userProfile.regions.reduce(
          (acc: PlaceSelection[], code: string) => {
            const selected = selections.find(s => s.Koodi === code);
            if (selected) acc.push(selected);
            return acc;
          },
          []
        );
      }

      setSelectedPlaces(values);
    }
  }, [userProfile]);

  const {
    data: jobPostings,
    isLoading: jobPostingsLoading,
    isFetching: jobPostingsFetching,
    error: jobPostingsError,
    refetch: fetchJobPostings,
    fetchNextPage,
    hasNextPage,
  } = useJobPostings(payload);
  console.log(jobPostings);

  // keep track of previous selected places to compare in useEffect
  const previousPlaces = usePrevious(selectedPlaces);

  /**
   * Track search / selectedPlaces state and construct payload
   */
  useEffect(() => {
    if (
      typeof search === 'string' ||
      selectedPlaces.length !== previousPlaces.length
    ) {
      const payload = {
        query: typeof search === 'string' ? search.split(' ').toString() : '',
        location: {
          regions: selectedPlaces
            .filter(p => p.type === PlaceType.REGION)
            .map(p => p.Koodi),
          municipalities: selectedPlaces
            .filter(p => p.type === PlaceType.MUNICIPALITY)
            .map(p => p.Koodi),
          countries: selectedPlaces
            .filter(p => p.type === PlaceType.COUNTRY)
            .map(p => p.Koodi),
        },
        paging: {
          items_per_page: itemsPerPage,
        },
      };

      setPayload(payload);
    }
  }, [itemsPerPage, previousPlaces.length, search, selectedPlaces]);

  /**
   * Track payload state and fetch jobPostings on change
   */
  useEffect(() => {
    if (payload) {
      fetchJobPostings();
    }
  }, [fetchJobPostings, payload]);

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
                  setSelectedPlaces(places => [
                    ...places,
                    JSON.parse(target.value),
                  ])
                }
              >
                <option disabled value="placeholder">
                  Select location...
                </option>
                <optgroup label="Region">
                  {mapSelectOptions(PlaceType.REGION, regions, selectedPlaces)}
                </optgroup>
                <optgroup label="Municipality">
                  {mapSelectOptions(
                    PlaceType.MUNICIPALITY,
                    municipalities,
                    selectedPlaces
                  )}
                </optgroup>
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

      {selectedPlaces.length > 0 && (
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
                  setSelectedPlaces(places =>
                    places.filter(p => p.Koodi !== place.Koodi)
                  )
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
                    {page?.results.map((item, index) => (
                      <JobPostingItem key={`${index}-${item.id}`} item={item} />
                    ))}
                  </React.Fragment>
                ))}
              </SimpleGrid>

              <Flex alignItems="center" mb={3}>
                <FormLabel>Results per page</FormLabel>
                <Select
                  w={40}
                  bg="white"
                  disabled={jobPostingsFetching}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setItemsPerPage(Number(event.target.value))
                  }
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
              </Flex>

              {hasNextPage && (
                <LoadMore
                  isLoading={jobPostingsFetching}
                  handleClick={() => fetchNextPage()}
                />
              )}

              {!jobPostingsFetching && !hasNextPage && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  my={8}
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
