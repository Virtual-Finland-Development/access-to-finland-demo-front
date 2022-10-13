import { UserProfile } from '../../../@types';

/**
 * Action types / actions
 */
export enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_LOADING = 'SET_LOADING',
  SET_USER_ID = 'SET_USER_ID',
  SET_PROFILE = 'SET_PROFILE',
  SET_ERROR = 'SET_ERROR',
}

type LogInAction = {
  type: ActionTypes.LOG_IN;
};

type LogOutAction = {
  type: ActionTypes.LOG_OUT;
};

type LoadingAction = {
  type: ActionTypes.SET_LOADING;
  loading: boolean;
};

type SetProfileAction = {
  type: ActionTypes.SET_PROFILE;
  userProfile: Partial<UserProfile>;
};

type ErrorAction = {
  type: ActionTypes.SET_ERROR;
  error: any;
};

export type Action =
  | LogInAction
  | LogOutAction
  | LoadingAction
  | SetProfileAction
  | ErrorAction;

/**
 * Appstate interface
 */
export interface AppState {
  authenticated: boolean;
  loading: boolean;
  userProfile: UserProfile | {};
  error: any;
}

/**
 * Initial state
 */
export const initialState: AppState = {
  authenticated: false,
  loading: false,
  userProfile: {},
  error: null,
};

/**
 * Reducer function
 */
export function appStateReducer(state: AppState, action: Action) {
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
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case ActionTypes.SET_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.userProfile,
        },
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
