import React, { useMemo } from 'react';
import {
  Collapse,
  Flex,
  Checkbox,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// types
import { OccupationOption } from '../../@types';

interface Props {
  item: OccupationOption;
  selectedNotations: string[];
  onSelect: (
    notation: string,
    checked: boolean,
    isIndeterminate: boolean
  ) => void;
}

export default function OccupationCollapseItem(props: Props) {
  const { item, selectedNotations, onSelect } = props;

  const isChecked = useMemo(
    () =>
      selectedNotations.findIndex(
        s => !s.includes('.') && s.startsWith(item.notation)
      ) > -1,
    [item.notation, selectedNotations]
  );

  const isIndeterminate = useMemo(
    () =>
      isChecked && selectedNotations.findIndex(s => s === item.notation) < 0,
    [isChecked, item.notation, selectedNotations]
  );

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen:
      (isChecked || isIndeterminate) &&
      (item.notation.length !== 1 ||
        (item.notation.length === 1 &&
          selectedNotations.some(
            n => n !== item.notation && n.startsWith(item.notation)
          ))),
  });

  const ToggleIcon = !isOpen ? ChevronDownIcon : ChevronUpIcon;

  if (item.narrower) {
    return (
      <React.Fragment>
        <Flex alignItems="center" mb={1}>
          <Checkbox
            mr={2}
            textAlign="start"
            cursor="default"
            isChecked={isChecked}
            isIndeterminate={isIndeterminate}
            onChange={e =>
              onSelect(item.notation, e.target.checked, isIndeterminate)
            }
          >
            <Text fontSize="sm">{item.prefLabel.en}</Text>
          </Checkbox>
          <ToggleIcon role="button" onClick={onToggle} boxSize={5} />
        </Flex>

        <Collapse in={isOpen}>
          {isOpen &&
            item.narrower?.map(item => (
              <Flex key={item.notation} ml={4} flexDirection="column">
                <OccupationCollapseItem
                  item={item}
                  onSelect={onSelect}
                  selectedNotations={selectedNotations}
                />
              </Flex>
            ))}
        </Collapse>
      </React.Fragment>
    );
  }

  return (
    <Flex ml={4} mb={2}>
      <Checkbox
        textAlign="start"
        cursor="default"
        isChecked={isChecked}
        onChange={e => {
          e.stopPropagation();
          onSelect(item.notation, e.target.checked, false);
        }}
      >
        <Text fontSize="sm">{item.prefLabel.en}</Text>
      </Checkbox>
    </Flex>
  );
}
