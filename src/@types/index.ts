export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

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

export interface Occupation {
  id?: string;
  naceCode?: string;
  escoUri?: string;
  escoCode?: string;
  workMonths?: number;
}

export interface UserOccupationSelection extends Occupation {
  label?: string;
  delete?: boolean;
}

export enum EmploymentType {
  'permanent',
  'temporary',
  'seasonal',
  'summerJob',
}

export interface WorkPreference {
  id?: string;
  preferredRegionEnum?: string[];
  preferredMunicipalityEnum?: string[];
  employmentTypeCode?: EmploymentType;
  workingTimeEnum?: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';
  workingLanguageEnum?: string;
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
  occupations: Occupation[];
  workPreferences: WorkPreference;
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
