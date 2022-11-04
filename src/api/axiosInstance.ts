import axios from 'axios';
import { isPast, parseISO } from 'date-fns';

// types
import { AuthProvider } from '../@types';

// endpoints
import { USER_API_BASE_URL } from './endpoints';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
  LOCAL_STORAGE_AUTH_USER_ID,
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

const DATA_URL = '';

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
  const authTokens = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);

  if (config.url !== undefined && config.headers !== undefined) {
    if (authTokens) {
      // pass id token for all user api calls
      if (USER_API_URLS.includes(config.url)) {
        const idToken = authTokens.idToken;
        config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
      }

      if ([DATA_URL].includes(config.url)) {
        // The token that is used to authorize the user in the protected, external API queries
        let authorizationToken = authTokens.idToken;
        // The exception: Sinuna does not operate with idToken, use accessToken instead
        if (provider === AuthProvider.SINUNA) {
          authorizationToken = authTokens.token;
        }

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
    const authTokens = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);
    const hasExpired = isPast(parseISO(authTokens.expiresAt));

    if (
      provider &&
      authTokens &&
      error?.response?.status === 401 &&
      hasExpired
    ) {
      alert('Your session has expired, please authenticate to continue.');
      localStorage.removeItem(LOCAL_STORAGE_AUTH_PROVIDER);
      localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKENS);
      localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_ID);
      window.postMessage(REQUEST_NOT_AUTHORIZED);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
