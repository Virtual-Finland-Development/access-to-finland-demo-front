import axiosInstance from '../axiosInstance';

// types
import { UserProfile } from '../../@types';

// endpoints
import { USER_API_ENDPOINT } from '../endpoints';

export async function verify() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/identity/testbed/verify`);
}

export async function get() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/user`);
}

export async function patch(payload: Partial<UserProfile>) {
  return axiosInstance.patch(`${USER_API_ENDPOINT}/user`, payload);
}

// profile related codesets
export function getCountries() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/code-sets/countries`);
}

export function getOccupations() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/code-sets/occupations`);
}

export function getLanguages() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/code-sets/languages`);
}

export function getGenders() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/code-sets/genders`);
}
