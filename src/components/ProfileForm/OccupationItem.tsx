import { Box, Tag, TagLabel } from '@chakra-ui/react';

// types
import { Occupation } from '../../@types';

interface OccupationItemProps {
  item: Occupation & { label: string };
}

export default function OccupationItem(props: OccupationItemProps) {
  const { item } = props;

  return (
    <Tag>
      <TagLabel>{item.label}</TagLabel>
    </Tag>
  );
}
