import React, { useMemo, useCallback, useState } from 'react';
import {
  Stack,
  Link,
  SimpleGrid,
  Text,
  Select,
  Flex,
  IconButton,
  Heading,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// types
import {
  JmfRecommendation,
  Occupation,
  OccupationOption,
  UserOccupationSelection,
} from '../../@types';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import OccupationItem from './OccupationItem';
import JmfRecommendationsSelect from '../JmfRecommendationsSelect/JmfRecommendationsSelect2';

interface UserOccupationsProps {
  userOccupations: UserOccupationSelection[] | null;
  occupationOptions: OccupationOption[];
  handleSave: (selected: UserOccupationSelection[]) => void;
}

export default function UserOccupations(props: UserOccupationsProps) {
  const { userOccupations, occupationOptions, handleSave } = props;

  const { openModal, closeModal } = useModal();

  /**
   * Add labels to user occupations
   */
  const userOccupationsWithLables = useMemo(() => {
    if (!userOccupations?.length || !occupationOptions) return [];

    return userOccupations
      .filter(o => !o.delete)
      .map(o => ({
        ...o,
        label:
          occupationOptions.find(option => option.uri === o.escoUri)?.prefLabel
            ?.en || '',
      }));
  }, [occupationOptions, userOccupations]);

  /**
   * Handle open occupations edit modal
   */
  const handleOpenEdit = () => {
    openModal({
      title: 'Occupations',
      content: (
        <UserOccupationsEdit
          userOccupations={userOccupationsWithLables}
          occupationOptions={occupationOptions}
          onSave={selected => {
            handleSave(selected);
            closeModal();
          }}
          onCancel={() => closeModal()}
        />
      ),
      size: '3xl',
      onClose: () => {},
    });
  };

  if (!userOccupationsWithLables?.length) {
    return (
      <Text fontSize="sm">
        No occupations selected,{' '}
        <Link color="blue.500" fontWeight="medium" onClick={handleOpenEdit}>
          click here to add.
        </Link>
      </Text>
    );
  }

  return (
    <Stack
      spacing={1}
      p={2}
      borderWidth={1}
      rounded="md"
      transitionDuration="0.2s"
      transitionTimingFunction="ease-in-out"
      _hover={{
        cursor: 'pointer',
        borderColor: 'gray.300',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease-in-out',
      }}
      onClick={handleOpenEdit}
    >
      <React.Fragment>
        <Link
          fontWeight="medium"
          fontSize="sm"
          color="blue.500"
          position="absolute"
          right={2}
          opacity={0}
          transitionDuration="0.2s"
          transitionTimingFunction="ease-in-out"
          _groupHover={{
            opacity: 1,
            transitionDuration: '0.2s',
            transitionTimingFunction: 'ease-in-out',
          }}
        >
          Click to edit
        </Link>
        <Stack alignItems="start" spacing={1}>
          {userOccupationsWithLables.map(o => (
            <OccupationItem key={o.escoUri} item={o} />
          ))}
        </Stack>
      </React.Fragment>
    </Stack>
  );
}

interface UserOccupationsEditProps {
  userOccupations: UserOccupationSelection[] | null;
  occupationOptions: OccupationOption[];
  onSave: (selected: UserOccupationSelection[]) => void;
  onCancel: () => void;
}

function UserOccupationsEdit(props: UserOccupationsEditProps) {
  const { userOccupations, occupationOptions, onSave, onCancel } = props;

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

      return selected.filter(s => !(!s.id && s.delete));
    });
  }, []);
  console.log(selected);
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
                  {/* <Select
                    size="sm"
                    onChange={({ target }) => {
                      if (['none', '0'].includes(target.value)) {
                        console.log(6);
                      }
                    }}
                  >
                    <option value="none">No experience</option>
                    <option value="0">Less than a year</option>
                    <option value="1">One year</option>
                    <option value="2">Two years</option>
                    <option value="4">Four years</option>
                    <option value="5">Five years</option>
                    <option value="7">More than five years</option>
                    <option value="10">More than ten years</option>
                  </Select> */}
                  <NumberInput size="sm" flexGrow={1}>
                    <NumberInputField placeholder="Work experience in years" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
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
