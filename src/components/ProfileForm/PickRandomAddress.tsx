import addresses from './fakeData/addresses.json';
import { Address } from '../../@types';

export const pickRandomAddress = () => {
  const number = Math.floor(Math.random() * addresses.length);
  const randomAddress = addresses[number];
  if (randomAddress) {
    let formattedAddress: Address = {
      street_address: randomAddress.detail + ' street',
      city: randomAddress.detail.split(',')[0],
      country: 'United States',
      zip_code: randomAddress.name,
    };
    return formattedAddress;
  }

  return {
    street_address: 'Mannerheimintie 42',
    city: 'Helsinki',
    zip_code: '00322',
    country: 'Suomi',
  };
};
