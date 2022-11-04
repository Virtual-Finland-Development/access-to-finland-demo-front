import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
  Reducer,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { isPast, parseISO } from 'date-fns';
import { useToast } from '@chakra-ui/react';

// types
import { AuthProvider, AuthTokens, UserProfile } from '../../@types';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
  LOCAL_STORAGE_AUTH_USER_ID,
  REQUEST_NOT_AUTHORIZED,
} from '../../constants';

// utils
import { JSONLocalStorage, isNewUser } from '../../utils';

// reducers
import {
  AppState,
  Action,
  appStateReducer,
  initialState,
  ActionTypes,
} from './reducers/appStateReducer';

// api
import api from '../../api';

interface AppContextInterface {
  authenticated: boolean;
  userProfile: any;
  loading: boolean;
  storeAuthKeysAndVerifyUser: (
    authProvider: AuthProvider,
    autTokens: AuthTokens,
    userEmail: string
  ) => void;
  logIn: () => void;
  logOut: () => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  error: any;
}

interface AppProviderProps {
  children: React.ReactElement;
}

/**
 * Helper function to determine valid login state
 */
export function validLoginState(): boolean {
  const authProvider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
  const authTokens = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);
  const authUserId = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_ID);
  const tokenNotExpired = authTokens?.expiresAt
    ? !isPast(parseISO(authTokens.expiresAt))
    : false;
  return authProvider && authTokens && authUserId && tokenNotExpired;
}

/**
 * App Context
 */
const AppContext = createContext<AppContextInterface | undefined>(undefined);
const AppConsumer = AppContext.Consumer;

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer<Reducer<AppState, Action>>(
    appStateReducer,
    initialState
  );
  const { authenticated, userProfile, loading, error } = state;
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Handle save user profile.
   */
  const setUserProfile = useCallback((userProfile: Partial<UserProfile>) => {
    dispatch({ type: ActionTypes.SET_PROFILE, userProfile });
  }, []);

  /**
   * Fetch user profile. Set user as logged in.
   * OR if user has not filled profile information, direct to profile step. (isNewUser)
   */
  const getUserProfileAndLogIn = useCallback(async () => {
    try {
      const response = await api.user.get();
      const userProfile: UserProfile = response.data;

      dispatch({ type: ActionTypes.SET_LOADING, loading: false });

      if (isNewUser(userProfile)) {
        navigate('profile');
        return;
      }

      dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_PROFILE, userProfile });
    } catch (error: any) {
      dispatch({ type: ActionTypes.SET_ERROR, error });
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [navigate, toast]);

  /**
   * Verify api user after authentication.
   * If user can be verified (user exists in api), fetch user profile, set user as logged in.
   * If user can't be verified === new user, direct to profile creation step. API will create the user in background.
   */
  const verifyUser = useCallback(async () => {
    try {
      const response = await api.user.verify();
      const verifiedUser: Partial<UserProfile> = response.data;

      if (isNewUser(verifiedUser)) {
        dispatch({ type: ActionTypes.SET_LOADING, loading: false });
        navigate('profile');
      } else {
        getUserProfileAndLogIn();
      }
    } catch (error: any) {
      dispatch({ type: ActionTypes.SET_ERROR, error });
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [getUserProfileAndLogIn, navigate, toast]);

  /**
   * Store auth keys to local storage, continue to verify user after authentication (Auth.tsx).
   */
  const storeAuthKeysAndVerifyUser = useCallback(
    (authProvider: AuthProvider, tokens: AuthTokens, authUserId: string) => {
      localStorage.setItem(LOCAL_STORAGE_AUTH_PROVIDER, authProvider);
      localStorage.setItem(LOCAL_STORAGE_AUTH_USER_ID, authUserId);
      JSONLocalStorage.set(LOCAL_STORAGE_AUTH_TOKENS, tokens);
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      verifyUser();
    },
    [verifyUser]
  );

  /**
   * Handle login.
   */
  const logIn = () => {
    dispatch({ type: ActionTypes.LOG_IN });
    navigate('/');
  };

  /**
   * Handle log out.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_AUTH_PROVIDER);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKENS);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_ID);
  }, []);

  /**
   * Handle set app state loading.
   */
  const setLoading = (loading: boolean) =>
    dispatch({ type: ActionTypes.SET_LOADING, loading });

  /**
   * Windows message event handler for logging user out, in case of unauthorized api calls.
   */
  const onWindowMessageEvent = useCallback(
    (event: MessageEvent) => {
      if (event.data === REQUEST_NOT_AUTHORIZED) {
        logOut();
        navigate('/');
      }
    },
    [logOut, navigate]
  );

  /**
   * If auth keys provided in local storage, and if token is not expired, try to fetch user profile and log user in.
   */
  useEffect(() => {
    if (validLoginState()) {
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      getUserProfileAndLogIn();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Add window event listener, used to track custom event message that is made from axios interceptor (axiosInstance.ts)
   */
  useEffect(() => {
    window.addEventListener('message', onWindowMessageEvent);
    return () => window.removeEventListener('message', onWindowMessageEvent);
  }, [onWindowMessageEvent]);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        userProfile,
        loading,
        storeAuthKeysAndVerifyUser,
        logIn,
        logOut,
        setUserProfile,
        setLoading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * useAppContext hook
 */
function useAppContext() {
  const context = useContext(AppContext) as AppContextInterface;

  if (context === undefined || context === null) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

export { AppContext, AppProvider, AppConsumer, useAppContext };
