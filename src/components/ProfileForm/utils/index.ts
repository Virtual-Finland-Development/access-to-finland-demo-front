import groupBy from 'lodash.groupby';
import addresses from '../fakeData/addresses.json';
import firstNames from '../fakeData/firstNames.json';
import lastNames from '../fakeData/lastNames.json';
import regionsJson from '../../VacanciesPage/regionJsons/regions.json';
import municipalitiesJson from '../../VacanciesPage/regionJsons/municipalities.json';
import naceCodes from '../../../jsons/nace.json';
import naceDotNotations from '../../../jsons/nace-dot-notated.json';

import {
  Address,
  OccupationOption,
  UserOccupationSelection,
  WorkPreference,
  Nace,
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
    ...(workPreferences.preferredRegionEnum
      ? workPreferences.preferredRegionEnum
      : []),
    ...(workPreferences.preferredMunicipalityEnum
      ? workPreferences.preferredMunicipalityEnum
      : []),
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

// parse changed occupations for profile payload
export function handleOccupationsForPayload(
  changed: UserOccupationSelection[],
  userOccupations: UserOccupationSelection[],
  occupations: OccupationOption[]
) {
  const changedOccupations = changed.reduce(
    (acc: UserOccupationSelection[], occupation) => {
      const existing = userOccupations.find(p => p.id === occupation.id);

      if (occupation.id && occupation.delete) {
        acc.push({ id: occupation.id, delete: true });
      }

      if (!occupation.id && !occupation.delete) {
        const escoCode =
          occupations.find(o => o.uri === occupation.escoUri)?.notation || '';
        acc.push({
          escoUri: occupation.escoUri,
          workMonths: occupation.workMonths,
          escoCode,
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

// parse changed workPreferences object for profile payload
export function handleWorkPreferencesForPayload(
  values: WorkPreference,
  userWorkPreferences: WorkPreference | null
) {
  try {
    let changedWorkPreferences: any = {};

    if (!userWorkPreferences?.id) {
      const filledValues: any = {};

      for (let key of Object.keys(values)) {
        const workPreferenceKey = key as keyof WorkPreference;

        if (values[workPreferenceKey]) {
          filledValues[workPreferenceKey] = values[workPreferenceKey];
        }
      }

      changedWorkPreferences = filledValues;
    } else {
      changedWorkPreferences = {
        id: userWorkPreferences.id,
      };

      for (const prefKey of Object.keys(values)) {
        const changed = values[prefKey as keyof WorkPreference];
        const existing = userWorkPreferences[prefKey as keyof WorkPreference];

        // if property is array (regions / municipalities)
        if (Array.isArray(changed) && Array.isArray(existing)) {
          const isSame =
            changed.length === existing.length &&
            changed.every(
              (item: string, index: number) => item === existing[index]
            );

          if (!isSame) {
            changedWorkPreferences[prefKey] = changed;
          }
          // else if not array, but value has changed
        } else if (changed !== existing) {
          changedWorkPreferences[prefKey] = changed;
        }
      }
    }

    return changedWorkPreferences;
  } catch (error) {
    throw error;
  }
}

export const EMPLOYMENT_TYPE_LABELS = {
  permanent: 'Permanent',
  temporary: 'Temporary',
  seasonal: 'Seasonal',
  summerJob: 'Summer job',
};

export const WORKING_TIME_LABELS = {
  '01': 'Day shift',
  '02': 'Evening shift',
  '03': 'Night shift',
  '04': 'Work in episodes',
  '05': 'Flexible hours',
  '06': 'Normal days',
  '07': 'Weekend hours',
  '08': 'Work in shifts',
};

// get grouped nace codes in hierarchy-level
// only include nace codes that are part of data definition
// include dot-notaded version of code for each (data definition, nace-dot-notaded.json)
export function getGroupedNaceCodes() {
  const addChildren = (
    item: Nace,
    groupedByBroader: any,
    topLevelGroupCode: string
  ) => {
    if (item.children) {
      for (let i = 0; i < item.children.length; i++) {
        const child = item.children[i];

        if (groupedByBroader[child.codeValue]) {
          item.children[i] = {
            ...child,
            children: groupedByBroader[child.codeValue],
            topLevelGroupCode,
          };
          addChildren(item.children[i], groupedByBroader, topLevelGroupCode);
        } else {
          item.children[i] = {
            ...child,
            topLevelGroupCode,
          };
        }
      }
    }
  };

  const codes: Nace[] = naceCodes as Nace[];
  const topLevel = codes.filter(c => !c.broaderCode && c.codeValue !== 'X');

  const groupedByBroader = groupBy(
    codes.reduce((acc: Nace[], c) => {
      const dotNotationCodeValue = naceDotNotations.find(
        dn => dn.replace('.', '') === c.codeValue
      );
      if (c.broaderCode && dotNotationCodeValue) {
        acc.push({ ...c, dotNotationCodeValue });
      }
      return acc;
    }, []),
    item => item.broaderCode?.codeValue
  );

  const groupedNaces = topLevel.map(item => {
    if (groupedByBroader[item.codeValue]) {
      const newItem: Nace = {
        ...item,
        children: groupedByBroader[item.codeValue],
        topLevelGroupCode: item.codeValue,
      };
      addChildren(newItem, groupedByBroader, item.codeValue);
      return newItem;
    }
    return item;
  });

  return groupedNaces;
}

// recursive function to find nace code from hierarchived nace codes
export const findNace = (
  options: Nace[],
  identifier: string
): Nace | undefined => {
  const formattedId = identifier.replace('.', '');

  for (const item of options) {
    const result =
      item.codeValue === formattedId
        ? item
        : findNace(item.children || [], formattedId);

    if (result) return result;
  }
};
