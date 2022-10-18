import { DefaultService } from '../openapi/generated';
import { AuthGWClient } from '../openapi/generated';

// types
import { AuthProvider } from '../../@types';

// endpoints
import { AUTH_GW_ENDPOINT } from '../endpoints';

// constants
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_AUTH_TOKENS,
} from '../../constants';

// utils
import { JSONLocalStorage } from '../../utils';

class AuthService {
  client: DefaultService;

  constructor() {
    this.client = new AuthGWClient({
      BASE: AUTH_GW_ENDPOINT,
      WITH_CREDENTIALS: true,
    }).default;
  }

  private getAuthRoute(authProvider: AuthProvider) {
    let route = '';

    switch (authProvider) {
      case AuthProvider.TESTBED:
      case AuthProvider.SINUNA:
        route = 'openid';
        break;
      case AuthProvider.SUOMIFI:
        route = 'saml2';
        break;
      default:
        route = 'openid';
    }

    return route;
  }

  directToAuthGwLogin(authProvider: AuthProvider) {
    const authRoute = this.getAuthRoute(authProvider);

    window.location.assign(
      `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/login-request?appContext=${appContextUrlEncoded}`
    );
  }

  directToAuthGwLogout(authProvider: AuthProvider) {
    const authRoute = this.getAuthRoute(authProvider);
    const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;

    window.location.assign(
      `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/logout-request?appContext=${appContextUrlEncoded}&idToken=${idToken}`
    );
  }

  async getAuthTokens(
    authPayload: {
      loginCode: string;
      appContext: string;
    },
    authProvider: AuthProvider
  ) {
    switch (authProvider) {
      case AuthProvider.TESTBED:
      case AuthProvider.SINUNA:
        return this.client.openIdAuthTokenRequest(authProvider, authPayload);
      case AuthProvider.SUOMIFI:
        return this.client.saml2AuthTokenRequest(authProvider, authPayload);
      default:
        throw new Error(`Invalid protocol: ${authPayload}`);
    }
  }

  async getUserInfo(
    authProvider: AuthProvider,
    payload: { accessToken: string; appContext: string }
  ) {
    switch (authProvider) {
      case AuthProvider.TESTBED:
      case AuthProvider.SINUNA:
        return this.client.openIdUserInfoRequest(authProvider, payload);
      case AuthProvider.SUOMIFI:
        return this.client.saml2UserInfoRequest(authProvider, payload);
      default:
        throw new Error(`Invalid protocol: ${authProvider}`);
    }
  }
}

const auth = new AuthService();

export default auth;
