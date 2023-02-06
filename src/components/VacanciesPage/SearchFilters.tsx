import { useMemo } from 'react';
import { Flex, Tag, TagLabel, TagCloseButton, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// types
import { PlaceSelection } from './types';
import { OccupationOption } from '../../@types';

type PlaceFilter = PlaceSelection & {
  filterType: 'place';
};

type OccupationFilter = OccupationOption & {
  filterType: 'occupation';
};

interface SearchFiltersProps {
  selectedPlaces: PlaceFilter[];
  selectedOccupations: OccupationFilter[];
  onClickRemoveFilter: (
    type: 'place' | 'occupation',
    identifier: string
  ) => void;
  onClickRemoveAll: () => void;
}

export default function SearchFilters(props: SearchFiltersProps) {
  const {
    selectedPlaces,
    selectedOccupations,
    onClickRemoveFilter,
    onClickRemoveAll,
  } = props;

  const mergedFilters = useMemo(() => {
    let merged: (PlaceFilter | OccupationFilter)[] = [];

    if (selectedPlaces && selectedPlaces.length > 0) {
      merged = [...selectedPlaces];
    }

    if (selectedOccupations && selectedOccupations.length > 0) {
      merged = [...merged, ...selectedOccupations];
    }

    return merged;
  }, [selectedOccupations, selectedPlaces]);

  if (!mergedFilters.length) {
    return null;
  }

  return (
    <Flex flexDirection="row" flexWrap="wrap" mt={4} gap={3}>
      {mergedFilters.map(filter => {
        let identifier = '';
        let label = '';

        if (filter.filterType === 'place') {
          identifier = filter.code;
          label = filter.label.en || filter.code;
        }

        if (filter.filterType === 'occupation') {
          identifier = filter.notation;
          label = filter.prefLabel.en;
        }

        return (
          <Tag
            key={identifier}
            size="lg"
            variant="outline"
            colorScheme={filter.filterType === 'place' ? 'teal' : 'purple'}
            bg="white"
          >
            <TagLabel fontSize="xs">{label}</TagLabel>
            <TagCloseButton
              onClick={() => onClickRemoveFilter(filter.filterType, identifier)}
            />
          </Tag>
        );
      })}

      <Flex alignItems={'center'}>
        <Button
          rightIcon={<CloseIcon w={2.5} h="auto" />}
          colorScheme="red"
          variant="outline"
          size="xs"
          minH="32px"
          onClick={onClickRemoveAll}
        >
          Clear all
        </Button>
      </Flex>
    </Flex>
  );
}
