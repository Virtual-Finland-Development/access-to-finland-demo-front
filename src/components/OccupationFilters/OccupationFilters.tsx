import { Button } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import OccupationsSelect from './OccupationsSelect';

interface OccupationFiltersProps {
  onSelect: (selected: string[]) => void;
  defaultSelected: string[];
}

export default function OccupationFilters(props: OccupationFiltersProps) {
  const { onSelect, defaultSelected } = props;
  const { openModal, closeModal } = useModal();

  const handleOpenFiltersModal = () =>
    openModal({
      title: 'Choose occupational groups as search terms',
      content: (
        <OccupationsSelect
          defaultSelected={defaultSelected}
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
      variant={defaultSelected.length ? 'solid' : 'outline'}
      rightIcon={<SmallAddIcon />}
      onClick={handleOpenFiltersModal}
    >
      Choose occupational groups{' '}
      {defaultSelected.length > 0 && `(${defaultSelected.length})`}
    </Button>
  );
}
