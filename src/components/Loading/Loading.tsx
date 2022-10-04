import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Flex justify="center" mt={24}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
}
