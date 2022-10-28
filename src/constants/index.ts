// application base url
import { APP_BASE_URL } from '../api/endpoints';

// local storage
export const LOCAL_STORAGE_AUTH_PROVIDER = 'atf-auth-provider';
export const LOCAL_STORAGE_AUTH_TOKENS = 'atf-auth-tokens';
export const LOCAL_STORAGE_AUTH_USER_ID = 'atf-auth-user-id';
export const LOCAL_STORAGE_ROUTE_NAME = 'atf-route-name';

// appContext
const applicationContextObj = {
  appName: 'access-to-finland-demo',
  redirectUrl: `${APP_BASE_URL}/auth`,
};

export const appContextUrlEncoded = (() => {
  const appContextBase64 = btoa(JSON.stringify(applicationContextObj));
  return encodeURIComponent(appContextBase64);
})();

export const REQUEST_NOT_AUTHORIZED = 'atf-request-not-authrorized';
