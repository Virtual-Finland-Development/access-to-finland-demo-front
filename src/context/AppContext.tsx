import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

// constants
import { LOCAL_STORAGE_LOGGED_IN } from '../constants';

interface AppState {
  authenticated: boolean;
  loading: boolean;
}

enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_LOADING = 'SET_LOADING',
}

interface LogInAction {
  type: ActionTypes.LOG_IN;
}

interface LogOutAction {
  type: ActionTypes.LOG_OUT;
}

interface LoadingAction {
  type: ActionTypes.SET_LOADING;
  loading: boolean;
}

type Action = LogInAction | LogOutAction | LoadingAction;

interface AppContextInterface {
  authenticated: boolean;
  loading: boolean;
  logIn: () => void;
  logOut: () => void;
}

interface AppProviderProps {
  children: React.ReactElement;
}

/**
 * State reduder
 */
const initialState: AppState = {
  authenticated: false,
  loading: false,
};

function reducer(state: AppState, action: Action) {
  switch (action.type) {
    case ActionTypes.LOG_IN:
      return {
        ...state,
        authenticated: true,
      };
    case ActionTypes.LOG_OUT:
      return {
        ...state,
        authenticated: false,
      };
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    default:
      return state;
  }
}

/**
 * App Context
 */
const AppContext = createContext<AppContextInterface | undefined>(undefined);
const AppConsumer = AppContext.Consumer;

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { authenticated, loading } = state;
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
   * Log in automatically if flag found on local storage.
   */
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem(LOCAL_STORAGE_LOGGED_IN);

    if (storedLoggedIn) {
      dispatch({ type: ActionTypes.LOG_IN });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        loading,
        logIn,
        logOut,
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
