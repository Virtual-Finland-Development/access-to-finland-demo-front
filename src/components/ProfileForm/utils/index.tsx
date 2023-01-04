import addresses from '../fakeData/addresses.json';
import firstNames from '../fakeData/firstNames.json';
import lastNames from '../fakeData/lastNames.json';
import regionsJson from '../../TmtPage/regionJsons/regions.json';
import municipalitiesJson from '../../TmtPage/regionJsons/municipalities.json';

import {
  Address,
  UserOccupationSelection,
  WorkPreference,
} from '../../../@types';
import { RegionSelectOption, RegionType } from '../types';

// pick and format random address from addresses json
export const pickRandomAddress = () => {
  const number = Math.floor(Math.random() * addresses.length);
  const randomAddress = addresses[number];

  if (randomAddress) {
    const formattedAddress: Address = {
      streetAddress: `${number} Street`,
      city: randomAddress.detail,
      country: 'United States',
      zipCode: randomAddress.name,
    };
    return formattedAddress;
  }

  return {
    streetAddress: 'Mannerheimintie 42',
    city: 'Helsinki',
    zipCode: '00322',
    country: 'Suomi',
  };
};

// pick randon first name / last name from name jsons
export const pickRandomName = (type: 'firstName' | 'lastName') => {
  const list: string[] = type === 'firstName' ? firstNames : lastNames;
  return list[Math.floor(Math.random() * list.length)] || type;
};

// format address object as string
export function formatAddress(addressObject: Address) {
  const { streetAddress, zipCode, city } = addressObject;
  let output = '';

  if (streetAddress) output = `${streetAddress}`;
  if (city) output += `, ${city}`;
  if (zipCode) output += ` ${zipCode}`;

  return output;
}

// create option for react-select
export function createOption(label: string) {
  return {
    label,
    value: label,
  };
}

// get default select option for react-select (counties/lanuages/occupation codes)
export function getDefaultSelectOption<T, U, V extends keyof U>(
  profilePropertyValue: T,
  list: U[] | undefined,
  identifier: V,
  labelProperty: V
) {
  if (!profilePropertyValue || !list) return null;

  return list
    .filter(item => item[identifier] === profilePropertyValue)
    .map(item => ({
      label: item[labelProperty],
      value: item[identifier],
    }));
}

// map default region options for react-select from user profile workPreferences regions/municipalities
export function getDefaultRegionOptions(workPreferences: WorkPreference) {
  let options: RegionSelectOption[] = [];
  const selections = [
    ...regionsJson.map(r => ({ ...r, type: RegionType.REGION })),
    ...municipalitiesJson.map(m => ({ ...m, type: RegionType.MUNICIPALITY })),
  ];

  if (!workPreferences) return [];

  const selected = [
    ...workPreferences.preferredRegionEnum,
    ...workPreferences.preferredMunicipalityEnum,
  ];

  if (selected?.length) {
    options = selected.reduce((acc: RegionSelectOption[], code) => {
      const singleSelected = selections.find(s => s.Koodi === code);

      if (singleSelected) {
        acc.push({
          value: singleSelected.Koodi,
          label: singleSelected.Selitteet[2].Teksti,
          type: singleSelected.type,
        });
      }

      return acc;
    }, []);
  }

  return options;
}

// return grouped regions options for react-select (mapped from regions / municipalities jsons)
export const groupedRegionOptions = [
  {
    label: 'Regions',
    options: regionsJson.map(r => ({
      value: r.Koodi,
      label: r.Selitteet[2].Teksti,
      type: RegionType.REGION,
    })),
  },
  {
    label: 'Municipalities',
    options: municipalitiesJson.map(m => ({
      value: m.Koodi,
      label: m.Selitteet[2].Teksti,
      type: RegionType.MUNICIPALITY,
    })),
  },
];

// parse changed occupations for profile save payload
export function handleOccupationsForPayload(
  changed: UserOccupationSelection[],
  userOccupations: UserOccupationSelection[]
) {
  const changedOccupations = changed.reduce(
    (acc: UserOccupationSelection[], occupation) => {
      const existing = userOccupations.find(p => p.id === occupation.id);

      if (occupation.id && occupation.delete) {
        acc.push({ id: occupation.id, delete: true });
      }

      if (!occupation.id) {
        acc.push({
          escoUri: occupation.escoUri,
          workMonths: occupation.workMonths,
        });
      }

      if (existing && occupation.workMonths !== existing.workMonths) {
        acc.push({ id: existing.id, workMonths: occupation.workMonths });
      }

      return acc;
    },
    []
  );

  return changedOccupations;
}
