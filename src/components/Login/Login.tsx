import { useState } from 'react';
import { Button, Heading, Stack } from '@chakra-ui/react';
import { IoLogIn } from 'react-icons/io5';

// types
import { AuthProvider } from '../../@types';

// assets
import sinunaSvg from '../../assets/sinuna.svg';
import suomiFiPng from '../../assets/suomifi.png';

// api
import api from '../../api';

enum LoginType {
  TESTBED,
  SINUNA,
  SUOMIFI,
}

const SinunaIcon = () => (
  <img src={sinunaSvg} alt="Sinuna logo" width="14" height="auto" />
);

const SuomiFiIcon = () => (
  <img src={suomiFiPng} alt="Suomi.fi logo" width="26" height="auto" />
);

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login button click. Redirect user to auth gw login request route.
   */
  const handleLoginClick = (loginType: LoginType) => {
    setIsLoading(true);

    if (loginType === LoginType.TESTBED) {
      api.auth.directToAuthGwLogin(AuthProvider.TESTBED);
    } else if (loginType === LoginType.SINUNA) {
      api.auth.directToAuthGwLogin(AuthProvider.SINUNA);
    } else if (loginType === LoginType.SUOMIFI) {
      api.auth.directToAuthGwLogin(AuthProvider.SUOMIFI);
    }
  };

  return (
    <Stack
      spacing={4}
      w="full"
      maxW="md"
      bg="white"
      rounded="xl"
      boxShadow="lg"
      p={6}
      my={12}
      mx={{ base: 4, md: 0 }}
    >
      <Heading
        lineHeight={1.1}
        fontSize={{ base: '2xl', md: '3xl' }}
        textAlign="center"
      >
        Log in
      </Heading>
      <Stack spacing={6}>
        <Button
          bg="blue.400"
          color="white"
          _hover={{
            bg: 'blue.500',
          }}
          leftIcon={<IoLogIn size="20" />}
          onClick={() => handleLoginClick(LoginType.TESTBED)}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Login with Testbed
        </Button>
        <Button
          bg="#203CCC"
          color="white"
          _hover={{
            bg: 'blue.500',
            _disabled: {
              bg: '#203CCC',
            },
          }}
          leftIcon={<SinunaIcon />}
          disabled
        >
          Login with Sinuna
        </Button>
        <Button
          bg="#003479"
          color="white"
          _hover={{
            bg: 'blue.500',
            _disabled: {
              bg: '#003479',
            },
          }}
          leftIcon={<SuomiFiIcon />}
          disabled
        >
          Login with Suomi.fi
        </Button>
        {/* <Button colorScheme="linkedin" leftIcon={<IoLogoLinkedin />} disabled>
          Login with LinkedIn
        </Button> */}
      </Stack>
    </Stack>
  );
}
