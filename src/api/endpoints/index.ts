export const APP_BASE_URL = (() => {
  const {
    location: { protocol, hostname, port },
  } = window;

  if (process.env.NODE_ENV === 'development') {
    return `${protocol}//${hostname}:${port}`;
  } else {
    return `${protocol}//${hostname}`;
  }
})();

export const AUTH_GW_BASE_URL =
  process.env.REACT_APP_AUTH_GW_BASE_URL ||
  'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com';
console.log(AUTH_GW_BASE_URL || 'no auth-gw url');

export const USERS_API_BASE_URL =
  process.env.REACT_APP_USERS_API_BASE_URL || 'http://localhost:5001';
console.log(USERS_API_BASE_URL || 'no users-api url');

export const TESTBED_API_BASE_URL =
  process.env.REACT_APP_TESTBED_API_BASE_URL ||
  'https://v2xw5b7nhqkduxcw6v56pas5yy0livjb.lambda-url.eu-north-1.on.aws';
console.log(TESTBED_API_BASE_URL || 'no testbed-api url');

export const EXT_REGISTRATION_SERVICE_URL =
  process.env.REACT_APP_EXT_REGISTRATION_SERVICE_URL || 'http://localhost:3001';
console.log(EXT_REGISTRATION_SERVICE_URL || 'no external-service-demo url');
