import firstNames from './fakeData/firstNames.json';
import lastNames from './fakeData/lastNames.json';

export const pickRandomName = (type: 'firstName' | 'lastName') => {
  const list: string[] = type === 'firstName' ? firstNames : lastNames;
  return list[Math.floor(Math.random() * list.length)] || type;
};
