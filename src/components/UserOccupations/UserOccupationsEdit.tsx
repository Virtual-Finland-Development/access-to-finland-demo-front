import React, { useCallback, useState } from 'react';
import {
  Stack,
  SimpleGrid,
  Text,
  Flex,
  IconButton,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { yearsToMonths } from 'date-fns';

// types
import {
  JmfRecommendation,
  Occupation,
  UserOccupationSelection,
} from '../../@types';

// components
import JmfRecommendationsSelect from '../JmfRecommendationsSelect/JmfRecommendationsSelect2';

interface UserOccupationsEditProps {
  userOccupations: UserOccupationSelection[] | null;
  onSave: (selected: UserOccupationSelection[]) => void;
  onCancel: () => void;
}

export default function UserOccupationsEdit(props: UserOccupationsEditProps) {
  const { userOccupations, onSave, onCancel } = props;

  const [selected, setSelected] = useState<UserOccupationSelection[]>(
    userOccupations || []
  );

  /**
   * Select / de-select occupations
   */
  const selectOccupation = useCallback((occupation: JmfRecommendation) => {
    setSelected(prev => {
      let selected = [...prev];
      const index = selected.findIndex(
        s => s.escoUri === occupation.uri && !s.delete
      );

      if (index > -1) {
        selected[index] = { ...selected[index], delete: true };
      } else {
        selected.push({
          label: occupation.label,
          escoUri: occupation.uri,
        });
      }

      return selected.filter(s => s.id || (!s.id && !s.delete));
    });
  }, []);

  /**
   * Change occupation workMonths
   */
  const updateOccupationExperience = useCallback(
    (occupation: UserOccupationSelection, experienceInYears: string) => {
      try {
        setSelected(prev => {
          let modified = [...prev].map(o => {
            if (!o.delete && o.escoUri === occupation.escoUri) {
              return {
                ...o,
                workMonths: yearsToMonths(parseFloat(experienceInYears)),
              };
            }
            return o;
          });

          return modified;
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  /**
   * Remove occupation from selected
   */
  const removeOccupation = (occupation: Occupation) => {
    setSelected(prev =>
      prev.map(o => {
        if (o.escoUri === occupation.escoUri) {
          return { ...o, delete: true };
        }
        return o;
      })
    );
  };

  /**
   * Handle selections save
   */
  const handleSave = useCallback(() => {
    onSave(selected);
  }, [onSave, selected]);

  const hasSelections = selected.filter(s => !s.delete).length > 0;

  return (
    <React.Fragment>
      <Stack borderWidth={1} rounded="md" p={4} mb={4}>
        <Heading as="h5" size="sm">
          Selected
        </Heading>
        {hasSelections ? (
          selected
            .filter(s => !s.delete)
            .map(occupation => (
              <SimpleGrid
                key={occupation.escoUri}
                columns={2}
                alignItems="center"
              >
                <Text fontSize={{ base: 'sm', md: 'md' }}>
                  {occupation.label}
                </Text>
                <Flex alignItems="center">
                  <Tooltip
                    hasArrow
                    placement="auto"
                    label="Work experience in years"
                  >
                    <NumberInput
                      size="sm"
                      flexGrow={1}
                      min={0}
                      step={0.5}
                      defaultValue={
                        occupation.workMonths
                          ? (occupation.workMonths / 12).toFixed(1).toString()
                          : undefined
                      }
                      onBlur={({ target }) =>
                        updateOccupationExperience(occupation, target.value)
                      }
                    >
                      <NumberInputField placeholder="Work experience in years" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Tooltip>
                  <IconButton
                    aria-label="remove occupation"
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    ml={2}
                    icon={<CloseIcon />}
                    onClick={() => removeOccupation(occupation)}
                  />
                </Flex>
              </SimpleGrid>
            ))
        ) : (
          <Text fontSize="sm">
            No selections. Use the search below for recommendations.
          </Text>
        )}
      </Stack>
      <JmfRecommendationsSelect
        selected={selected}
        setSelected={selectOccupation}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </React.Fragment>
  );
}
