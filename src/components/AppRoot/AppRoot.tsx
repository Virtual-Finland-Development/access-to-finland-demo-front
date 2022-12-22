import { Flex, Stack, Button } from '@chakra-ui/react';

// context
import { AppProvider, AppConsumer } from '../../context/AppContext/AppContext';
import { ModalProvider } from '../../context/ModalContext/ModalContext';

// routes
import LoginRoutes from '../LoginRoutes/LoginRoutes';
import AuthRoutes from '../AuthRoutes/AuthRoutes';

// components
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function AppRoot() {
  return (
    <AppProvider>
      <AppConsumer>
        {provider => {
          if (typeof provider === 'undefined') {
            return null;
          }

          const { authenticated, loading, error, logOut } = provider;

          if (loading || error) {
            return (
              <Flex h="100vh" alignItems="center" justifyContent="center">
                {loading && <Loading />}
                {error && (
                  <Stack w="full" maxW="md">
                    <ErrorMessage
                      error={error}
                      addition={
                        <Button
                          variant="link"
                          color="blue.500"
                          fontWeight="normal"
                          onClick={logOut}
                        >
                          Go to Home
                        </Button>
                      }
                    />
                  </Stack>
                )}
              </Flex>
            );
          }

          return (
            <ModalProvider>
              {!authenticated ? <LoginRoutes /> : <AuthRoutes />}
            </ModalProvider>
          );
        }}
      </AppConsumer>
    </AppProvider>
  );
}
