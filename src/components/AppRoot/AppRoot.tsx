import { Flex } from '@chakra-ui/react';

// context
import { AppProvider, AppConsumer } from '../../context/AppContext/AppContext';
import { ModalProvider } from '../../context/ModalContext/ModalContext';

// routes
import LoginRoutes from '../LoginRoutes/LoginRoutes';
import AuthRoutes from '../AuthRoutes/AuthRoutes';

// components
import Loading from '../Loading/Loading';

export default function AppRoot() {
  return (
    <AppProvider>
      <ModalProvider>
        <AppConsumer>
          {provider => {
            if (typeof provider === 'undefined') {
              return null;
            }

            const { authenticated, loading } = provider;

            if (loading) {
              return (
                <Flex
                  h="100vh"
                  alignItems="center"
                  justifyContent="center"
                  bg="gray.50"
                >
                  <Loading />
                </Flex>
              );
            }

            return !authenticated ? <LoginRoutes /> : <AuthRoutes />;
          }}
        </AppConsumer>
      </ModalProvider>
    </AppProvider>
  );
}
