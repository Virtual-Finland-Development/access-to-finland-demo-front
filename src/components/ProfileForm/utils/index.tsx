import addresses from '../fakeData/addresses.json';
import firstNames from '../fakeData/firstNames.json';
import lastNames from '../fakeData/lastNames.json';
import regionsJson from '../../TmtPage/regionJsons/regions.json';
import municipalitiesJson from '../../TmtPage/regionJsons/municipalities.json';

import { Address, OccupationOption } from '../../../@types';
import { SelectOption, SelectGroupedOption } from '../types';

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

// map grouped occupation options for react-select
export function getGroupedOccupations(occupations: OccupationOption[]) {
  return occupations.reduce(
    (grouped: SelectGroupedOption[], occupation, _index, allOccupations) => {
      if (occupation.hierarchyLevel === 1) {
        grouped.push({
          label: occupation.name.en,
          options: allOccupations
            .filter(o => o.hierarchyLevel > 1 && o.id.startsWith(occupation.id))
            .reduce((options: SelectOption[], occupation) => {
              const foundIndex = options.findIndex(
                o => o.label === occupation.name.en
              );

              if (foundIndex < 0) {
                options.push({
                  label: occupation.name.en,
                  value: occupation.id,
                });
              }
              return options;
            }, [])
            .sort((a, b) => a.label.localeCompare(b.label)),
        });
      }
      return grouped;
    },
    []
  );
}

// map default region options for react-select from user profile regions
export function getDefaultRegionOptions(regions: string[]) {
  let options: SelectOption[] = [];
  const selections = [...regionsJson, ...municipalitiesJson];

  if (regions?.length) {
    options = regions.reduce((acc: SelectOption[], code) => {
      const selected = selections.find(s => s.Koodi === code);

      if (selected) {
        acc.push({
          value: selected.Koodi,
          label: selected.Selitteet[2].Teksti,
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
    })),
  },
  {
    label: 'Municipalities',
    options: municipalitiesJson.map(m => ({
      value: m.Koodi,
      label: m.Selitteet[2].Teksti,
    })),
  },
];
