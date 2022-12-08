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

export const USER_API_BASE_URL =
  process.env.REACT_APP_USER_API_BASE_URL || 'http://localhost:5001';

export const EXT_REGISTRATION_SERVICE_URL =
  process.env.REACT_APP_EXT_REGISTRATION_SERVICE_URL || 'http://localhost:3001';

export const TESTBED_API_BASE_URL =
  process.env.REACT_APP_TESTBED_API_BASE_URL ||
  'https://v2xw5b7nhqkduxcw6v56pas5yy0livjb.lambda-url.eu-north-1.on.aws';

const PULUMI_OUTPUTS_TEST =
  process.env.REACT_APP_PULUMI_OUTPUTS_TEST || 'did not work';
console.log(PULUMI_OUTPUTS_TEST);
