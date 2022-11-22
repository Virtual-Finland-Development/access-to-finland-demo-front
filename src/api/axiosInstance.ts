import axios from 'axios';
import { isPast, parseISO } from 'date-fns';

// types

// endpoints
import { USER_API_BASE_URL, TMT_API_URL } from './endpoints';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
  REQUEST_NOT_AUTHORIZED,
} from '../constants';

// utils
import { JSONLocalStorage } from '../utils';

// Create axios instance for api services
const axiosInstance = axios.create();

const USER_API_URLS = [
  `${USER_API_BASE_URL}/identity/verify`,
  `${USER_API_BASE_URL}/user`,
  `${USER_API_BASE_URL}/code-sets/countries`,
  `${USER_API_BASE_URL}/code-sets/occupations`,
  `${USER_API_BASE_URL}/code-sets/languages`,
  `${USER_API_BASE_URL}/code-sets/genders`,
];

const DATA_URLS = [`${TMT_API_URL}`];

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
  const loggedInState = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);

  if (config.url !== undefined && config.headers !== undefined) {
    if (loggedInState) {
      // pass id token for all user api calls
      if (USER_API_URLS.includes(config.url)) {
        const idToken = loggedInState.idToken;
        config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
      }

      if (DATA_URLS.includes(config.url)) {
        // The token that is used to authorize the user in the protected, external API queries
        let authorizationToken = loggedInState.idToken;

        config.headers.Authorization = authorizationToken
          ? `Bearer ${authorizationToken}`
          : '';
        config.headers['X-authorization-provider'] = provider
          ? `${provider}`
          : '';
      }
    }
  }

  return config;
});

// Axios response interceptor. Catch all 401 exceptions (unauthorized), post message to window for logging user out (AppContext)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
    const loggedInState = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);
    const hasExpired = loggedInState?.expiresAt
      ? isPast(parseISO(loggedInState.expiresAt))
      : false;

    if (
      provider &&
      loggedInState &&
      error?.response?.status === 401 &&
      hasExpired
    ) {
      alert('Your session has expired, please authenticate to continue.');
      localStorage.clear();
      window.postMessage(REQUEST_NOT_AUTHORIZED);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
