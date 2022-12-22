import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
} from '@chakra-ui/react';

// hooks
import useOccupations from '../../hooks/useOccupations';

// components
import OccupationCollapseItem from './OccupationCollapseItem';
import Loading from '../Loading/Loading';

interface OccupationSelectProps {
  useAsFilter?: boolean;
  defaultSelected: string[];
  onSelectOccupations: (selected: string[]) => void;
  onCancel: () => void;
}

export default function OccupationsSelect(props: OccupationSelectProps) {
  const {
    useAsFilter,
    defaultSelected = [],
    onSelectOccupations,
    onCancel,
  } = props;

  const [selectedNotations, setSelectedNotations] =
    useState<string[]>(defaultSelected);

  const {
    data: occupations,
    isLoading: occupationsLoading,
    flattenedOccupations,
    occupationsMostInnerDepth,
  } = useOccupations();

  /**
   * Handle select occupations (notation codes)
   * Only include top level notations, if no sub level notations are not selected
   * This 'algorithm' could be improved...
   */
  const handleSelect = useCallback(
    (notation: string, isChecked: boolean, isIndeterminate: boolean) => {
      if (!useAsFilter) {
        if (isChecked || isIndeterminate) {
          return setSelectedNotations([notation]);
        } else {
          return setSelectedNotations([]);
        }
      }

      let set = [...selectedNotations];

      if (isChecked) {
        set = [...set, notation];
      } else {
        if (isIndeterminate) {
          set = set.filter(i => !i.startsWith(notation)).concat(notation);
        } else {
          set = set.filter(i => i !== notation);
        }
      }

      const filtered = set
        .sort((a, b) => b.localeCompare(a))
        .reduce((acc: string[], item) => {
          if (
            (item.length === occupationsMostInnerDepth &&
              acc.findIndex(i => i === item) < 0) ||
            (item.length > 1 &&
              acc.findIndex(i => i.endsWith(notation.slice(-2))) < 0)
          ) {
            acc.push(item);
          }
          if (!acc.some(i => i.startsWith(item.slice(0, 2)))) {
            acc.push(item);
          }
          return acc;
        }, []);

      setSelectedNotations(filtered);
    },
    [useAsFilter, selectedNotations, occupationsMostInnerDepth]
  );

  /**
   * Track selected occupations
   */
  const selectedOccupations = useMemo(() => {
    if (!flattenedOccupations || !selectedNotations.length) return [];
    if (selectedNotations.length)
      return flattenedOccupations.filter(o =>
        selectedNotations.includes(o.notation)
      );
    return [];
  }, [flattenedOccupations, selectedNotations]);

  if (occupationsLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Box
        p={4}
        border="1px"
        borderRadius="base"
        borderColor="#DCDCDC"
        backgroundColor="blue.50"
      >
        <Heading as="h5" size="sm">
          Occupational groups
        </Heading>
        <Text mt={2}>
          {useAsFilter
            ? `You may select one or more occupational groups from the list as search
          terms. Choice of occupational group also includes all lower-level
          occupational groups.`
            : 'Select your occupational group.'}
        </Text>
        <Box
          py={2}
          mt={3}
          border="1px"
          borderRadius="base"
          borderColor="blue.100"
          backgroundColor="white"
          h={300}
          overflowY="auto"
        >
          {occupations && (
            <Box mx={4}>
              {occupations.map(item => (
                <OccupationCollapseItem
                  key={item.notation}
                  item={item}
                  selectedNotations={selectedNotations}
                  onSelect={handleSelect}
                />
              ))}
            </Box>
          )}
        </Box>
        {selectedOccupations.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="semibold" fontSize="md">
              {useAsFilter
                ? 'Occupational groups you have chosen'
                : 'Selected occupational group'}
            </Text>
            <Flex flexDirection={'row'} flexWrap="wrap" mt={2} gap={2}>
              {selectedOccupations.map(s => (
                <Tag key={s.notation} size="md" colorScheme="purple">
                  <TagLabel fontSize="sm">{s.prefLabel.en}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      setSelectedNotations(prev =>
                        prev.filter(i => i !== s.notation)
                      )
                    }
                  />
                </Tag>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
      <Stack
        mt={4}
        spacing={4}
        direction={['column', 'row']}
        justifyContent="end"
      >
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          onClick={() => onSelectOccupations(selectedNotations)}
        >
          {useAsFilter ? 'Add to search terms' : 'Select'}
        </Button>
      </Stack>
    </React.Fragment>
  );
}
