export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AppContextObj = {
  appName: string;
  redirectUrl: string | URL;
  guid?: string;
  provider?: string;
  meta?: Record<string, string>; // Additional metadata
};

export type LoggedInState = {
  idToken: string;
  expiresAt: string;
  profileData: {
    userId: string; // sub, inum etc.
    email: string; // Email is not always available
    [key: string]: any;
  };
};

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface Address {
  streetAddress: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: Address;
  jobTitles: string[];
  regions: string[];
  created: string;
  modified: string;
  jobsDataConsent: boolean;
  countryOfBirthCode: string;
  occupationCode: string;
  citizenshipCode: string;
  nativeLanguageCode: string;
  gender: Gender;
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
  notation: string;
  uri: string;
  prefLabel: {
    en: string;
  };
  narrower?: OccupationOption[];
}

export interface LanguageOption {
  id: string;
  englishName: string;
}

export interface JmfRecommendation {
  uri: string;
  label: string;
}

export interface JmfRecommendationsRequestPayload {
  text: string;
  maxNumberOfSkills: number;
  maxNumberOfOccupations: number;
  language: string;
}

export interface JmfRecommendationsResponse {
  skills: JmfRecommendation[];
  occupations: JmfRecommendation[];
}
