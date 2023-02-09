import {
  Collapse,
  Flex,
  Checkbox,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// types
import { Nace } from '../../@types';

interface CollapseLabelProps {
  item: Nace;
  isTopLevel: boolean;
  isChecked: boolean;
  isIndeterminate: boolean;
  onSelect: (
    code: string,
    isChecked: boolean,
    isIndeterminate: boolean
  ) => void;
  onToggle: () => void;
}

function CollapseLabel(props: CollapseLabelProps) {
  const { item, isTopLevel, isChecked, isIndeterminate, onSelect, onToggle } =
    props;

  return isTopLevel ? (
    <Box role="button" cursor="pointer" onClick={onToggle}>
      <Text fontSize="sm" fontWeight="medium">
        {item.prefLabel.en}
      </Text>
    </Box>
  ) : (
    <Checkbox
      mr={2}
      textAlign="start"
      cursor="default"
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      onChange={e =>
        onSelect(item.codeValue, e.target.checked, isIndeterminate)
      }
    >
      <Text fontSize="sm">{item.prefLabel.en}</Text>
    </Checkbox>
  );
}

interface NaceCollapseItemsProps {
  item: Nace;
  selected: Nace | undefined;
  onSelect: (
    identifier: string,
    checked: boolean,
    isIndeterminate: boolean
  ) => void;
}

export default function NaceCollapseItem(props: NaceCollapseItemsProps) {
  const { item, selected, onSelect } = props;

  const isChecked = Boolean(
    selected &&
      (selected.codeValue.startsWith(item.codeValue) ||
        selected.topLevelGroupCode === item.codeValue)
  );

  const isIndeterminate = Boolean(
    selected && isChecked && selected.codeValue !== item.codeValue
  );

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: isChecked || isIndeterminate,
  });

  const ToggleIcon = !isOpen ? ChevronDownIcon : ChevronUpIcon;

  if (item.children) {
    return (
      <>
        <Flex alignItems="center" mb={1}>
          <CollapseLabel
            isTopLevel={isNaN(parseInt(item.codeValue))}
            item={item}
            isChecked={isChecked}
            isIndeterminate={isIndeterminate}
            onSelect={onSelect}
            onToggle={onToggle}
          />
          <ToggleIcon role="button" onClick={onToggle} boxSize={5} />
        </Flex>

        <Collapse in={isOpen}>
          {isOpen &&
            item.children?.map(item => (
              <Flex key={item.codeValue} ml={4} flexDirection="column">
                <NaceCollapseItem
                  item={item}
                  onSelect={onSelect}
                  selected={selected}
                />
              </Flex>
            ))}
        </Collapse>
      </>
    );
  }

  return (
    <Flex ml={4} mb={2}>
      <CollapseLabel
        isTopLevel={false}
        item={item}
        isChecked={isChecked}
        isIndeterminate={isIndeterminate}
        onSelect={onSelect}
        onToggle={onToggle}
      />
    </Flex>
  );
}
