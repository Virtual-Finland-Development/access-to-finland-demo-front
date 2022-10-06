import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
  Reducer,
} from 'react';
import { useNavigate } from 'react-router-dom';

// constants
import { LOCAL_STORAGE_LOGGED_IN } from '../../constants';

// reducers
import {
  AppState,
  Action,
  appStateReducer,
  initialState,
  ActionTypes,
} from './reducers/appStateReducer';

interface AppContextInterface {
  authenticated: boolean;
  userId: null | string;
  userProfile: any;
  loading: boolean;
  logIn: () => void;
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
   * Handle login.
   */
  const logIn = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_IN });
    localStorage.setItem(LOCAL_STORAGE_LOGGED_IN, 'true');
  }, []);

  /**
   * Handle log out.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_LOGGED_IN);
    navigate('/');
  }, [navigate]);

  /**
   * Handle save user profile.
   */
  const setUserProfile = useCallback((profile: any) => {
    dispatch({ type: ActionTypes.SET_USER_ID, userId: '123-random' });
    dispatch({ type: ActionTypes.SET_PROFILE, profile });
  }, []);

  /**
   * Log in automatically if flag found on local storage.
   */
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem(LOCAL_STORAGE_LOGGED_IN);

    if (storedLoggedIn) {
      dispatch({ type: ActionTypes.LOG_IN });
    }
  }, []);

  /**
   * Dummy dummy
   */
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');

    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      dispatch({ type: ActionTypes.SET_USER_ID, userId: '123-random' });
      dispatch({ type: ActionTypes.SET_PROFILE, profile });
    }
  }, []);

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
