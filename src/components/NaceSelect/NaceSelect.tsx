import { useState, useCallback } from 'react';
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

// types
import { Nace } from '../../@types';

// components
import NaceCollapseItem from './NaceCollapseItem';

// utils
import { findNace } from '../ProfileForm/utils';

interface NaceSelectProps {
  options: Nace[];
  defaultSelected: Nace | undefined;
  onSelect: (selected: Nace | undefined) => void;
  onCancel: () => void;
}

export default function NaceSelect(props: NaceSelectProps) {
  const { options, defaultSelected = undefined, onSelect, onCancel } = props;

  const [selected, setSelected] = useState<Nace | undefined>(defaultSelected);

  const handleSelect = useCallback(
    (identifier: string, isChecked: boolean, isIndeterminate: boolean) => {
      if (isChecked || isIndeterminate) {
        return setSelected(findNace(options, identifier));
      } else {
        return setSelected(undefined);
      }
    },
    [options]
  );

  return (
    <>
      <Box
        p={4}
        border="1px"
        borderRadius="base"
        borderColor="#DCDCDC"
        backgroundColor="blue.50"
      >
        <Heading as="h5" size="sm">
          Industrial group
        </Heading>
        <Text mt={2}>
          Select your preferred industrial group. Choice of industrial group
          also includes all lower-level industrial groups
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
          <Box mx={4}>
            {options.map(item => (
              <NaceCollapseItem
                key={item.codeValue}
                item={item}
                selected={selected}
                onSelect={handleSelect}
              />
            ))}
          </Box>
        </Box>
        {selected && (
          <Box mt={4}>
            <Flex flexDirection={'row'} flexWrap="wrap" mt={2} gap={2}>
              <Tag size="md" colorScheme="purple">
                <TagLabel fontSize="sm">{selected.prefLabel.en}</TagLabel>
                <TagCloseButton onClick={() => setSelected(undefined)} />
              </Tag>
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
          onClick={() => onSelect(selected)}
        >
          Select
        </Button>
      </Stack>
    </>
  );
}
