export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type LoggedInState = {
  idToken: string;
  expiresAt: string;
  profileData: {
    email?: string;
    [key: string]: any;
  };
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
  citizenshipCode: string;
  nativeLanguageCode: string;
  gender: string;
  dateOfBirth: string;
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

export interface LanguageOption {
  id: string;
  englishName: string;
}
