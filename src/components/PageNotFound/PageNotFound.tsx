import { Link as ReactRouterLink } from 'react-router-dom';
import { Box, Heading, Text, Link } from '@chakra-ui/react';

export default function PageNotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page not found
      </Text>
      <Text color={'gray.500'} mb={6}>
        Sorry nothing here!
      </Text>
      <Link as={ReactRouterLink} to="/" color="blue.700">
        Go to Home
      </Link>
    </Box>
  );
}
