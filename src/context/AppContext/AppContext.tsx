import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
  Reducer,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { isSameSecond, isPast, parseISO } from 'date-fns';
import { useToast } from '@chakra-ui/react';

// types
import { AuthProvider, AuthTokens, UserProfile } from '../../@types';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
  LOCAL_STORAGE_AUTH_USER_ID,
  appContextUrlEncoded,
} from '../../constants';

// utils
import { JSONLocalStorage } from '../../utils';

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
  setUserProfile: (profile: any) => void;
  error: any;
}

interface AppProviderProps {
  children: React.ReactElement;
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
   */
  const getUserProfileAndLogIn = useCallback(async () => {
    try {
      const response = await api.user.get();
      const userProfile: UserProfile = response.data;
      dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_LOADING, loading: false });
      dispatch({ type: ActionTypes.SET_PROFILE, userProfile });
    } catch (error: any) {
      dispatch({ type: ActionTypes.SET_ERROR, error });
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 50000,
        isClosable: true,
      });
    }
  }, [toast]);

  /**
   * Verify api user after authentication.
   * If user can be verified (user exists in api), fetch user profile, set user as logged in.
   * If user can't be verified === new user, direct to profile creation step.
   */
  const verifyUser = useCallback(async () => {
    try {
      const response = await api.user.verify();
      const { id: userId, created, modified } = response.data;
      const isNewUser = isSameSecond(parseISO(created), parseISO(modified));
      console.log('USERID:', userId);
      console.log(created);
      console.log(modified);
      console.log(isNewUser);

      if (isNewUser) {
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
        duration: 50000,
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
  const logIn = () => dispatch({ type: ActionTypes.LOG_IN });

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
   * Try to verify user / log in to app automatically, if.
   */
  useEffect(() => {
    const authProvider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
    const authTokens = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);
    const authUserId = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_ID);

    if (authProvider && authTokens && authUserId) {
      if (!isPast(parseISO(authTokens.expiresAt))) {
        dispatch({ type: ActionTypes.SET_LOADING, loading: true });
        getUserProfileAndLogIn();
        // verifyUser();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
