import { Container, Stack, Heading, Box, Link } from '@chakra-ui/react';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
} from '../../constants';
import { EXT_REGISTRATION_SERVICE_URL } from '../../api/endpoints';

export default function ServicesPage() {
  const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);

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
        <Stack spacing={10} alignItems='start'>
          <Link
            color='blue.500'
            isExternal
            href={`${EXT_REGISTRATION_SERVICE_URL}/auth?provider=${provider}`}
            fontSize='xl'
          >
            Foreigner Registration
          </Link>
          <Link
            color='gray.500'
            _hover={{ textDecoration: 'none', cursor: 'default' }}
            fontSize='xl'
          >
            Disabled link to nowhere 1
          </Link>
          <Link
            color='gray.500'
            _hover={{ textDecoration: 'none', cursor: 'default' }}
            fontSize='xl'
          >
            Disabled link to nowhere 2
          </Link>
          <Link
            color='gray.500'
            _hover={{ textDecoration: 'none', cursor: 'default' }}
            fontSize='xl'
          >
            Disabled link to nowhere 3
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
