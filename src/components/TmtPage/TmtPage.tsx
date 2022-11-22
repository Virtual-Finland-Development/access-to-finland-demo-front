import { useState, useCallback, useEffect, FormEvent } from 'react';
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
import Pagination from '../Pagination/Pagination';

// data hooks
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
  const [paginationState, setPaginationState] = useState<{
    offset: number;
    limit: number;
  }>({
    offset: 0,
    limit: 100,
  });

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
  } = useJobPostings(payload);

  useEffect(() => {
    if (typeof search === 'string' || selectedPlaces.length) {
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
          limit: paginationState.limit || 100,
          offset: paginationState.offset || 0,
        },
      };
      console.log('yo');
      setPayload(payload);
    }
  }, [paginationState.limit, paginationState.offset, search, selectedPlaces]);

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

  const handlePaginationStateChange = useCallback(
    (offset: number, limit: number) => {
      setPaginationState({ offset, limit });
    },
    []
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

      {jobPostings?.results && (
        <div style={{ position: 'relative' }}>
          {jobPostingsFetching && <Loading asOverlay />}

          <SimpleGrid columns={1} spacing={5} mt={6} mb={6}>
            {jobPostings.results.map(item => (
              <JobPostingItem
                key={`${item.basicInfo.title}-${item.publishedAt}`}
                item={item}
              />
            ))}
          </SimpleGrid>

          <Pagination
            total={jobPostings.totalCount}
            onPaginationStateChange={handlePaginationStateChange}
          />
        </div>
      )}
    </>
  );
}
