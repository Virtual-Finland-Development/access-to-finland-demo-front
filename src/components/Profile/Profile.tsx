import { useState } from 'react';
import { Heading, Stack, Flex, Button, Spinner } from '@chakra-ui/react';

// types
import { AuthProvider } from '../../@types';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// components
import ProfileForm from '../ProfileForm/ProfileForm';

// api
import api from '../../api';

export default function Profile() {
  const { logIn } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onProfileSubmit = () => {
    logIn();
  };

  /**
   * Handle log out click.
   */
  const handleLogOutClick = () => {
    setIsLoading(true);

    const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER)!;
    api.auth.directToAuthGwLogout(provider as AuthProvider);
  };

  return (
    <Stack
      spacing={4}
      w="full"
      maxW="lg"
      bg="white"
      rounded="xl"
      boxShadow="lg"
      p={6}
      my={12}
      mx={{ base: 4, md: 0 }}
    >
      <Flex justifyContent="space-between" w="100" position="relative">
        <Stack>
          <Heading lineHeight={1.1} fontSize={{ base: 'xl', sm: '2xl' }}>
            Welcome
          </Heading>
          <Heading fontSize={{ base: 'lg', sm: 'xl' }}>
            Please fill your profile information to continue
          </Heading>
        </Stack>
        {!isLoading ? (
          <Button
            variant="link"
            color="blue.500"
            onClick={handleLogOutClick}
            position="absolute"
            right={0}
            fontSize="sm"
          >
            Sign out
          </Button>
        ) : (
          <Spinner size="md" color="blue.500" />
        )}
      </Flex>
      <ProfileForm onProfileSubmit={onProfileSubmit} />
    </Stack>
  );
}
