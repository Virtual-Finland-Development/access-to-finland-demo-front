export const AUTH_GW_ENDPOINT =
  'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com';

export const USER_API_ENDPOINT =
  process.env.NODE_ENV !== 'production'
    ? 'https://im46dbktwe3mnbo5bzd6kk4i3m0mpnbf.lambda-url.eu-north-1.on.aws'
    : 'http://localhost:5001';
