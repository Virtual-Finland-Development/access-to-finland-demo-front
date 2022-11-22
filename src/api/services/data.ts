import axiosInstance from '../axiosInstance';
import { TMT_API_URL } from '../endpoints';
import { JobPostingsRequestPayload } from '../../components/TmtPage/types';

export async function getPokemons(limit: number, offset: number) {
  return axiosInstance.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
}

export async function getJobPostings(payload: JobPostingsRequestPayload) {
  return axiosInstance.post(`${TMT_API_URL}`, payload);
}
