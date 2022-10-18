// local storage
export const LOCAL_STORAGE_AUTH_PROVIDER = 'atf-auth-provider';
export const LOCAL_STORAGE_AUTH_TOKENS = 'atf-auth-tokens';
export const LOCAL_STORAGE_AUTH_USER_ID = 'atf-auth-user-id';
export const LOCAL_STORAGE_ROUTE_NAME = 'atf-route-name';

// appContext
const applicationBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://duem4bx7ribgb.cloudfront.net'
    : 'http://localhost:3001';
const applicationContextObj = {
  appName: 'access-to-finland-demo',
  redirectUrl: `${applicationBaseUrl}/auth`,
};
export const appContextUrlEncoded = (() => {
  const appContextBase64 = btoa(JSON.stringify(applicationContextObj));
  return encodeURIComponent(appContextBase64);
})();

export const REQUEST_NOT_AUTHORIZED = 'atf-request-not-authrorized';
