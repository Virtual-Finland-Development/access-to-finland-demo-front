import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { RequestPayload } from '../types';

// api
import api from '../../../api';

export default function usePokemons(payload: RequestPayload) {
  const pokemonsQuery = useQuery(
    ['pokemons'],
    async () => {
      const response = await api.data.getPokemons(
        payload.limit,
        payload.offset
      );
      return response.data;
    },
    {
      keepPreviousData: true,
      enabled: false, // disable query on mount
    }
  );

  /**
   * Remove the query from cache on unmount.
   */
  useEffect(() => {
    return () => pokemonsQuery.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return pokemonsQuery;
}
