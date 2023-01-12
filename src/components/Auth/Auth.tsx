import { Link, Stack, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Link as ReactRouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// types
import { AuthProvider } from '../../@types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// constants
import { LOCAL_STORAGE_ROUTE_NAME } from '../../constants';

// components
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loading from '../Loading/Loading';

// api
import api from '../../api';
import { generateAppContextHash } from '../../utils';

export default function Auth() {
  const { storeAuthKeysAndVerifyUser, logOut } = useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // parse query params
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const authProviderParam = queryParams.get('provider');
  const loginCodeParam = queryParams.get('loginCode');
  const logOutParam = queryParams.get('logout');
  const errorParam = queryParams.get('error');
  const errorType = queryParams.get('type');
  const authError = errorParam && errorType === 'danger';

  /**
   * Catch any auth errors, on either LoginRequest / LogOutRequest intent
   */
  useEffect(() => {
    if (authError) {
      setError({ message: errorParam });
      toast({
        title: 'Error.',
        description: errorParam,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [authError, errorParam, toast]);

  /**
   * Handle authentication.
   */
  const handleAuthentication = useCallback(
    async (authProvider: AuthProvider) => {
      try {
        // get token
        const loggedInState = await api.auth.logIn(
          {
            loginCode: loginCodeParam as string,
            appContext: generateAppContextHash(),
          },
          authProvider
        );

        storeAuthKeysAndVerifyUser(
          authProviderParam as AuthProvider,
          loggedInState,
          loggedInState.profileData.userId
        );
        navigate(localStorage.getItem(LOCAL_STORAGE_ROUTE_NAME) || '/');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [authProviderParam, storeAuthKeysAndVerifyUser, loginCodeParam, navigate]
  );

  /**
   * Handle user authentication, if Auth GW redirect occured.
   */
  useEffect(() => {
    if (authProviderParam && loginCodeParam) {
      setLoading(true);

      if (
        Object.values(AuthProvider).includes(authProviderParam as AuthProvider)
      ) {
        handleAuthentication(authProviderParam as AuthProvider);
      }
    } else if (!authError) {
      navigate('/');
    }
  }, [
    authError,
    authProviderParam,
    handleAuthentication,
    loginCodeParam,
    navigate,
  ]);

  /**
   * Handle user log out, if Auth GW log out redirect occured.
   */
  useEffect(() => {
    if (logOutParam) {
      if (logOutParam === 'success') {
        logOut();
        navigate('/');
      } else {
        setLoading(false);
        setError({ message: 'Logout request failed.' });
        toast({
          title: 'Error.',
          description: 'Logout request failed.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [logOut, logOutParam, navigate, toast]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Stack w="full" maxW="md">
        <ErrorMessage
          error={error}
          addition={
            <Link as={ReactRouterLink} to="/" color="blue.500">
              Go to Home
            </Link>
          }
        />
      </Stack>
    );
  }

  return null;
}
