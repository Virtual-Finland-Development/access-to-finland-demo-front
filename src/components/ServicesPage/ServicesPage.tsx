import { Container, Stack, Heading, Box, Link } from '@chakra-ui/react';

export default function ServicesPage() {
  return (
    <Container maxW={'3xl'}>
      <Stack as={Box} spacing={{ base: 8, md: 14 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
          lineHeight={'110%'}
        >
          Other services
        </Heading>
        <Stack spacing={10}>
          <Link color="blue.500">Link to somewhere</Link>
          <Link
            color="gray.500"
            _hover={{ textDecoration: 'none', cursor: 'default' }}
          >
            Disabled link to nowhere 1
          </Link>
          <Link
            color="gray.500"
            _hover={{ textDecoration: 'none', cursor: 'default' }}
          >
            Disabled link to nowhere 2
          </Link>
          <Link
            color="gray.500"
            _hover={{ textDecoration: 'none', cursor: 'default' }}
          >
            Disabled link to nowhere 3
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
