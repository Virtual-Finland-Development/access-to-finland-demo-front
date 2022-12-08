import axiosInstance from '../axiosInstance';

// types
import { UserProfile } from '../../@types';

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
export function getCountries() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/countries`);
}

export function getOccupations() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/occupations`);
}

export function getLanguages() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/languages`);
}

export function getGenders() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/genders`);
}
