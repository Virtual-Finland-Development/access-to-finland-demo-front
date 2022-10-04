import axios from 'axios';

async function getPokemons(limit: number, offset: number) {
  return axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
}

const api = {
  getPokemons,
};

export default api;
