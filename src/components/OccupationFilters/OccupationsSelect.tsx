import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Accordion,
  Heading,
  Text,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
} from '@chakra-ui/react';

// hooks
import useOccupations from '../ProfileForm/hooks/useOccupations';

// components
import OccupationAccordionItem from './OccupationAccordionItem';
import Loading from '../Loading/Loading';

interface OccupationSelectProps {
  defaultSelected: string[];
  onSelectOccupations: (selected: string[]) => void;
  onCancel: () => void;
}

export default function OccupationsSelect(props: OccupationSelectProps) {
  const { defaultSelected, onSelectOccupations, onCancel } = props;
  const [selectedNotations, setSelectedNotations] = useState<string[]>([]);
  const {
    data: occupations,
    isLoading: occupationsLoading,
    flattenedOccupations,
  } = useOccupations();

  /**
   * Set default selected notations, if provided
   */
  useEffect(() => {
    if (defaultSelected.length) {
      setSelectedNotations(defaultSelected);
    }
  }, [defaultSelected]);

  /**
   * Handle select occupations (notation codes)
   * Only include top level notations, if no sub level notations are not selected
   * This 'algorithm' could be improved...
   */
  const handleSelect = useCallback(
    (notation: string, isChecked: boolean, isIndeterminate: boolean) => {
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
          if (item.length === 4 && acc.findIndex(i => i === item) < 0) {
            acc.push(item);
          }
          if (!acc.some(i => i.startsWith(item.slice(0, 2)))) {
            acc.push(item);
          }
          return acc;
        }, []);

      setSelectedNotations(filtered);
    },
    [selectedNotations]
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
          You may select one or more occupational groups from the list as search
          terms. Choice of occupational group also includes all lower-level
          occupational groups.
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
            <Accordion allowMultiple reduceMotion>
              {occupations.map(item => (
                <OccupationAccordionItem
                  key={item.notation}
                  item={item}
                  selectedNotations={selectedNotations}
                  onSelect={handleSelect}
                />
              ))}
            </Accordion>
          )}
        </Box>
        {selectedOccupations.length > 0 && (
          <Flex flexDirection={'row'} flexWrap="wrap" mt={4} gap={2}>
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
          Add to search terms
        </Button>
      </Stack>
    </React.Fragment>
  );
}
