import axiosInstance from '../axiosInstance';

// types
import {
  CountryOption, LanguageOption, OccupationOption
} from '../../@types';

// endpoints
import { CODESETS_BASE_URL } from '../endpoints';

// profile related codesets
export async function getCountries(): Promise<CountryOption[]> {
  const { data } = await axiosInstance.get(
    `${CODESETS_BASE_URL}/resources/ISO3166CountriesURL`
  );
  return data;
}

export async function getOccupations(): Promise<OccupationOption[]> {
  const { data } = await axiosInstance.get(
    `${CODESETS_BASE_URL}/resources/OccupationsEscoURL`
  );
  return data;
}

export async function getOccupationsFlat(): Promise<OccupationOption[]> {
  const { data } = await axiosInstance.get(
    `${CODESETS_BASE_URL}/resources/OccupationsFlatURL`
  );
  return data;
}

export async function getLanguages(): Promise<LanguageOption[]> {
  const { data } = await axiosInstance.get(
    `${CODESETS_BASE_URL}/resources/ISO639Languages`
  );
  return data;
}