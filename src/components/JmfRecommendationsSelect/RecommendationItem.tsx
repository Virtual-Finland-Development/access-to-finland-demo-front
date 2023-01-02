import { Button } from '@chakra-ui/react';
import { CheckIcon, AddIcon } from '@chakra-ui/icons';

// types
import { JmfRecommendation } from '../../@types';

interface RecommendationItemProps {
  type: 'occupation' | 'skill';
  item: JmfRecommendation;
  isSelected: boolean;
  handleClick: (r: JmfRecommendation) => void;
}

export default function RecommendationItem(props: RecommendationItemProps) {
  const { type, item, isSelected, handleClick } = props;
  const Icon = isSelected ? CheckIcon : AddIcon;

  return (
    <Button
      key={item.label}
      size="sm"
      colorScheme={type === 'occupation' ? 'pink' : 'purple'}
      variant={isSelected ? 'solid' : 'outline'}
      rightIcon={<Icon />}
      onClick={() => handleClick(item)}
      whiteSpace="initial"
      height="auto"
      textAlign="left"
      paddingX={3}
      paddingY={2}
      borderWidth="1px"
    >
      {item.label}
    </Button>
  );
}
