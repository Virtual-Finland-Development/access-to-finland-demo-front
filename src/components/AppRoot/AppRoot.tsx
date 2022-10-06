// context
import { AppProvider, AppConsumer } from '../../context/AppContext/AppContext';
import { ModalProvider } from '../../context/ModalContext/ModalContext';

// routes
import LoginRoutes from '../LoginRoutes/LoginRoutes';
import AuthRoutes from '../AuthRoutes/AuthRoutes';

export default function AppRoot() {
  return (
    <AppProvider>
      <ModalProvider>
        <AppConsumer>
          {provider => {
            if (typeof provider === 'undefined') {
              return null;
            }

            const { authenticated /* loading  */ } = provider;

            return !authenticated ? <LoginRoutes /> : <AuthRoutes />;
          }}
        </AppConsumer>
      </ModalProvider>
    </AppProvider>
  );
}
