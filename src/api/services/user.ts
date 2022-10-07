import axiosInstance from '../axiosInstance';

// endpoints
import { USER_API_ENDPOINT } from '../endpoints';

export async function verify() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/identity/testbed/verify`);
}

export async function get() {
  return axiosInstance.get(`${USER_API_ENDPOINT}/user`);
}

export async function patch() {
  return axiosInstance.patch(`${USER_API_ENDPOINT}/user`);
}
