import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Container maxW={'3xl'}>
      <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          Meeting place for <br />
          <Text as={'span'} color={'blue.400'}>
            people and jobs
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          At Job Market Finland, you can find information content and services
          related to employment.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          <Button
            colorScheme={'green'}
            bg={'green.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'green.500',
            }}
            onClick={() => navigate('/vacancies')}
          >
            Get Started
          </Button>
          <Button
            variant={'link'}
            colorScheme={'blue'}
            size={'sm'}
            onClick={() => navigate('/about')}
          >
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
