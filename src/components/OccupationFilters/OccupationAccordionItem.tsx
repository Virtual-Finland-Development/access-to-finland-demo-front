import { useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Text,
  Flex,
} from '@chakra-ui/react';

// types
import { OccupationOption } from '../../@types';

interface OccupationAccordionItemProps {
  item: OccupationOption;
  selectedNotations: string[];
  onSelect: (
    notation: string,
    checked: boolean,
    isIndeterminate: boolean
  ) => void;
}

export default function OccupationAccordionItem(
  props: OccupationAccordionItemProps
) {
  const { item, selectedNotations, onSelect } = props;

  const isChecked = useMemo(
    () => selectedNotations.findIndex(s => s.startsWith(item.notation)) > -1,
    [item.notation, selectedNotations]
  );

  const isIndeterminate = useMemo(
    () =>
      isChecked && selectedNotations.findIndex(s => s === item.notation) < 0,
    [isChecked, item.notation, selectedNotations]
  );

  if (item.narrower) {
    return (
      <AccordionItem id={item.notation} borderTop="none" borderBottom="none">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              py={0}
              mb={1}
              width="auto"
              _hover={{ background: 'none' }}
              onClick={e => e.stopPropagation()}
            >
              <Checkbox
                mr={2}
                textAlign="start"
                cursor="default"
                isChecked={isChecked}
                isIndeterminate={isIndeterminate}
                onChange={e => {
                  e.stopPropagation();
                  onSelect(item.notation, e.target.checked, isIndeterminate);
                }}
              >
                <Text fontSize="sm">{item.prefLabel.en}</Text>
              </Checkbox>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel py={0} pr={0}>
              <Accordion allowMultiple reduceMotion>
                {isExpanded &&
                  item.narrower?.map(item => (
                    <OccupationAccordionItem
                      key={item.notation}
                      item={item}
                      onSelect={onSelect}
                      selectedNotations={selectedNotations}
                    />
                  ))}
              </Accordion>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
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
