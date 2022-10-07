import axios from 'axios';

// types
import { AuthProvider } from './types';

// endpoints
import { USER_API_ENDPOINT } from './endpoints';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
} from '../constants';

// utils
import { JSONLocalStorage } from '../utils';

// Create axios instance for api services
const axiosInstance = axios.create();

const USER_API_URLS = [
  `${USER_API_ENDPOINT}/identity/testbed/verify`,
  `${USER_API_ENDPOINT}/user`,
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

export default axiosInstance;
