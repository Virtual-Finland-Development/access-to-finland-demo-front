/**
 * Action types / actions
 */
export enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_LOADING = 'SET_LOADING',
  SET_USER_ID = 'SET_USER_ID',
  SET_PROFILE = 'SET_PROFILE',
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

type SetUserId = {
  type: ActionTypes.SET_USER_ID;
  userId: string;
};

type SetProfileAction = {
  type: ActionTypes.SET_PROFILE;
  profile: object;
};

export type Action =
  | LogInAction
  | LogOutAction
  | LoadingAction
  | SetUserId
  | SetProfileAction;

/**
 * Appstate interface
 */
export interface AppState {
  authenticated: boolean;
  loading: boolean;
  userId: null | string;
  userProfile: {};
}

/**
 * Initial state
 */
export const initialState: AppState = {
  authenticated: false,
  loading: false,
  userId: null,
  userProfile: {},
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
    case ActionTypes.SET_USER_ID:
      return {
        ...state,
        userId: action.userId,
      };
    case ActionTypes.SET_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.profile,
        },
      };
    default:
      return state;
  }
}
