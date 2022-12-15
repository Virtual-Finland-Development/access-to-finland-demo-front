import { Button } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import OccupationsSelect from './OccupationsSelect';

interface OccupationFiltersProps {
  onSelect: (selected: string[]) => void;
}

export default function OccupationFilters({
  onSelect,
}: OccupationFiltersProps) {
  const { openModal, closeModal } = useModal();

  const handleOpenFiltersModal = () =>
    openModal({
      title: 'Choose occupational groups as search terms',
      content: (
        <OccupationsSelect
          onSelectOccupations={(selected: string[]) => {
            onSelect(selected);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
      size: '3xl',
      onClose: () => {},
    });

  return (
    <Button
      colorScheme="purple"
      variant="outline"
      rightIcon={<SmallAddIcon />}
      onClick={handleOpenFiltersModal}
    >
      Choose occupational groups
    </Button>
  );
}
