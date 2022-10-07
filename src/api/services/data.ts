import axiosInstance from '../axiosInstance';

export async function getPokemons(limit: number, offset: number) {
  return axiosInstance.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
}
