// context
import { AppProvider, AppConsumer } from '../../context/AppContext';

// routes
import LoginRoutes from '../LoginRoutes/LoginRoutes';
import AuthRoutes from '../AuthRoutes/AuthRoutes';

export default function AppRoot() {
  return (
    <AppProvider>
      <AppConsumer>
        {provider => {
          if (typeof provider === 'undefined') {
            return null;
          }

          const { authenticated /* loading  */ } = provider;

          return !authenticated ? <LoginRoutes /> : <AuthRoutes />;
        }}
      </AppConsumer>
    </AppProvider>
  );
}
