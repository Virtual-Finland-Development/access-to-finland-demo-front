import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
  Reducer,
} from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { AuthProvider, AuthTokens } from '../../api/types';

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
  userId: null | string;
  userProfile: any;
  loading: boolean;
  logIn: (
    authProvider: AuthProvider,
    autTokens: AuthTokens,
    userEmail: string
  ) => void;
  logOut: () => void;
  setUserProfile: (profile: any) => void;
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
  const { authenticated, userId, userProfile, loading } = state;
  const navigate = useNavigate();

  /**
   * Handle save user profile.
   */
  const setUserProfile = useCallback((profile: any) => {
    dispatch({ type: ActionTypes.SET_USER_ID, userId: '123-random' });
    dispatch({ type: ActionTypes.SET_PROFILE, profile });
  }, []);

  /**
   * Fetch user profile.
   */
  const getUserProfile = useCallback(async () => {
    try {
      const response = await api.user.get();
      console.log(response);
      dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_LOADING, loading: false });
    } catch (error) {
      console.log(error);
    }
  }, []);

  /**
   * Verify api user after authentication.
   * If user can be verified (user exists in api), fetch user profile, set user as logged in.
   * If user can't be verified === new user, direct to profile creation step.
   */
  const verifyUser = useCallback(async () => {
    try {
      const response = await api.user.verify();
      const { id: userId } = response.data;
      console.log(response);
      console.log(userId);
      getUserProfile();
    } catch (error: any) {
      console.log(error);
      if (error?.code === 404) {
        navigate('profile');
      }
    }
  }, [getUserProfile, navigate]);

  /**
   * Handle login.
   */
  const logIn = useCallback(
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
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      verifyUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider
      value={{
        authenticated,
        userId,
        userProfile,
        loading,
        logIn,
        logOut,
        setUserProfile,
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
