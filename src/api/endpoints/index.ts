export const APP_BASE_URL = (() => {
  switch (process.env.REACT_APP_ENV) {
    case 'local':
      return 'http://localhost:3000';
    case 'development':
      return 'https://duem4bx7ribgb.cloudfront.net';
    case 'staging':
      return '';
    case 'production':
      throw new Error('Production endpoint not yet defined');
    default:
      throw new Error(
        `Unknown runtime environment: ${process.env.RUNTIME_ENV}`
      );
  }
})();

export const AUTH_GW_ENDPOINT = (() => {
  switch (process.env.REACT_APP_ENV) {
    case 'local':
    case 'development':
      return 'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com ';
    case 'staging':
      return '';
    // @ts-ignore
    case 'production':
      throw new Error('Production endpoint not yet defined');
    default:
      throw new Error(
        `Unknown runtime environment: ${process.env.REACT_APP_ENV}`
      );
  }
})();

export const USER_API_ENDPOINT = (() => {
  switch (process.env.REACT_APP_ENV) {
    case 'local':
      return 'http://localhost:5001';
    case 'development':
      return 'https://im46dbktwe3mnbo5bzd6kk4i3m0mpnbf.lambda-url.eu-north-1.on.aws';
    case 'staging':
      return '';
    // @ts-ignore
    case 'production':
      throw new Error('Production endpoint not yet defined');
    default:
      throw new Error(
        `Unknown runtime environment: ${process.env.REACT_APP_ENV}`
      );
  }
})();
