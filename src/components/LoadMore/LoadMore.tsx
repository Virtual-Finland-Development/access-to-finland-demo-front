import { Flex, Button } from '@chakra-ui/react';

export default function LoadMore({
  isLoading,
  isDisabled,
  handleClick,
}: {
  isLoading: boolean;
  isDisabled: boolean;
  handleClick: () => void;
}) {
  return (
    <Flex pt={2} pb={8} w="100%" justifyContent="center">
      <Button
        colorScheme="blue"
        isLoading={isLoading}
        disabled={isLoading || isDisabled}
        onClick={handleClick}
      >
        Load more results
      </Button>
    </Flex>
  );
}
