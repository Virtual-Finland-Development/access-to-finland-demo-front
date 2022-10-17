import { Box, Heading, Container, Text, Stack, Link } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <Container maxW={'3xl'}>
      <Stack as={Box} spacing={{ base: 8, md: 14 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
          textAlign={'center'}
        >
          Access to{' '}
          <Text as={'span'} color={'blue.400'}>
            Finland
          </Text>
        </Heading>
        <Stack spacing={3} alignItems="start">
          <Text color={'gray.500'}>
            Are you planning on becoming employed in Finland? At{' '}
            <i>
              <b>Job Market Finland</b>
            </i>{' '}
            vacancies search, you can find information content and services
            related to employment.
          </Text>
          <Link as={ReactRouterLink} to="vacancies" color="blue.500">
            Search for open vacancies here
          </Link>
        </Stack>
        <Stack spacing={3} alignItems="start">
          <Text color={'gray.500'}>Looking for other useful services?</Text>
          <Link as={ReactRouterLink} to="services" color="blue.500">
            See other services here
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
