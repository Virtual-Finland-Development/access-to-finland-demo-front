import axiosInstance from '../axiosInstance';

// types
import {
  UserProfile,
  CountryOption,
  OccupationOption,
  LanguageOption,
} from '../../@types';

// endpoints
import { USERS_API_BASE_URL } from '../endpoints';

export async function verify() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/identity/verify`);
}

export async function get() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/user`);
}

export async function patch(payload: Partial<UserProfile>) {
  return axiosInstance.patch(`${USERS_API_BASE_URL}/user`, payload);
}

// profile related codesets
export async function getCountries(): Promise<CountryOption[]> {
  const { data } = await axiosInstance.get(
    `${USERS_API_BASE_URL}/code-sets/countries`
  );
  return data;
}

export async function getOccupations(): Promise<OccupationOption[]> {
  const { data } = await axiosInstance.get(
    `${USERS_API_BASE_URL}/code-sets/occupations`
  );
  return data;
}

export async function getLanguages(): Promise<LanguageOption[]> {
  const { data } = await axiosInstance.get(
    `${USERS_API_BASE_URL}/code-sets/languages`
  );
  return data;
}

export function getGenders() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/genders`);
}
