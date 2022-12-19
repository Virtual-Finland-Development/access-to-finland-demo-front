import React, { useState } from 'react';
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

export default function Profile({ isEdit }: { isEdit?: boolean }) {
  const { logIn } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onProfileSubmit = () => {
    if (!isEdit) {
      logIn();
    }
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
      bg="white"
      rounded="lg"
      boxShadow="lg"
      p={6}
      maxW="container.xl"
    >
      <Flex justifyContent="space-between" w="100" position="relative">
        <Stack>
          <Heading lineHeight={1.1} fontSize={{ base: 'xl', sm: '2xl' }}>
            {!isEdit ? 'Welcome' : 'Profile'}
          </Heading>
          {!isEdit && (
            <Heading fontSize={{ base: 'lg', sm: 'xl' }}>
              Please fill your profile information to continue
            </Heading>
          )}
        </Stack>
        {!isEdit && (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </Flex>

      <ProfileForm onProfileSubmit={onProfileSubmit} isEdit={isEdit} />
    </Stack>
  );
}
