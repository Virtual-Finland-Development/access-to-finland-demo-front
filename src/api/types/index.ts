export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AuthTokens = {
  accessToken: string; // UserInfoRequest
  idToken: string; // Other requests (except for Sinuna, which uses accessToken instead)
};
