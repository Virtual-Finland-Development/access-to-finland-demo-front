import React, { useMemo } from 'react';
import { Stack, Link, Text, Tag, TagLabel } from '@chakra-ui/react';

// types
import { OccupationOption, UserOccupationSelection } from '../../@types';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import UserOccupationsEdit from './UserOccupationsEdit';

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
            <Tag key={o.escoUri}>
              <TagLabel>{o.label}</TagLabel>
            </Tag>
          ))}
        </Stack>
      </React.Fragment>
    </Stack>
  );
}
