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
  Spinner,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// types
import { PlaceType, PlaceSelection } from './types';

// components
import JobPostingItem from './JobPostingItem';
import Pagination from '../Pagination/Pagination';

// data hooks
import usePokemons from './hooks/usePokemons';

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
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [search, setSearch] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceSelection[]>([]);
  const [paginationState, setPaginationState] = useState<{
    offset: number;
    limit: number;
  }>({
    offset: 0,
    limit: 25,
  });

  const {
    data: pokeData,
    isLoading: dataLoading,
    isFetching: dataFething,
    refetch,
  } = usePokemons({
    search,
    selectedPlaces,
    limit: paginationState.limit,
    offset: paginationState.offset,
  });

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
          limit: paginationState.limit || 25,
          offset: paginationState.offset || 0,
        },
      };
      refetch();
    }
  }, [
    refetch,
    paginationState.limit,
    paginationState.offset,
    search,
    selectedPlaces,
  ]);

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
            <FormControl w="auto">
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
            <Button type="submit" colorScheme="green" isDisabled={dataFething}>
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

      {dataLoading && dataFething && (
        <Flex justify={'center'} mt={24}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}

      {pokeData?.results && (
        <>
          <SimpleGrid
            columns={1}
            spacing={5}
            mt={6}
            mb={6}
            opacity={dataFething ? '0.5' : '1'}
          >
            {pokeData.results.map((item: any, index: number) => (
              <JobPostingItem key={item.name} mockItem={item} index={index} />
            ))}
          </SimpleGrid>

          <Pagination
            total={pokeData.count}
            onPaginationStateChange={handlePaginationStateChange}
          />
        </>
      )}
    </>
  );
}
