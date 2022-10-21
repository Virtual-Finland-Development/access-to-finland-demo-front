export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AuthTokens = {
  accessToken: string;
  idToken: string;
  expiresAt: string;
};

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  jobTitles: string[];
  regions: string[];
  created: string;
  modified: string;
  jobsDataConsent: boolean;
  countryOfBirthCode: string;
  occupationCode: string;
}

export interface CountryOption {
  displayName: string;
  englishName: string;
  id: string;
  nativeName: string;
  threeLetterISORegionName: string;
  twoLetterISORegionName: string;
}

export interface OccupationOption {
  id: string;
  name: {
    en: string;
  };
}
