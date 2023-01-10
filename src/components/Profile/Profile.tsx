import { Button, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';

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
import { ConsentDataSource } from '../../constants/ConsentDataSource';
import { getConsentContext } from '../../context/ConsentContext/ConsentContext';
const { ConsentConsumer } = getConsentContext(ConsentDataSource.USER_PROFILE);

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
      {...(!isEdit ? { my: 6 } : { mb: 6 })}
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

      <ConsentConsumer>
        {provider => {
          if (typeof provider === 'undefined') {
            return null;
          }
          return (
            <ProfileForm onProfileSubmit={onProfileSubmit} isEdit={isEdit} />
          );
        }}
      </ConsentConsumer>
    </Stack>
  );
}
