// application base url
import { AppContextObj } from '../@types';
import { APP_BASE_URL } from '../api/endpoints';
import { generateAppContextHash } from '../utils';

// local storage
export const LOCAL_STORAGE_AUTH_PROVIDER = 'atf-auth-provider';
export const LOCAL_STORAGE_AUTH_TOKENS = 'atf-auth-tokens';
export const LOCAL_STORAGE_AUTH_USER_ID = 'atf-auth-user-id';
export const LOCAL_STORAGE_ROUTE_NAME = 'atf-route-name';

// appContext
export const baseAppContext: AppContextObj = {
  appName: 'access-to-finland-demo',
  redirectUrl: `${APP_BASE_URL}/auth`,
};
export const appContextUrlEncoded = generateAppContextHash(baseAppContext);

export const REQUEST_NOT_AUTHORIZED = 'atf-request-not-authrorized';
