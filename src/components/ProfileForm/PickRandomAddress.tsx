import addresses from './fakeData/addresses.json';

export const pickRandomAddress = () => {
  const number = Math.floor(Math.random() * addresses.length);
  const address = addresses[number];
  return address
    ? `${number} ${address.detail} ${address.name}`
    : 'Random address 123';
};
