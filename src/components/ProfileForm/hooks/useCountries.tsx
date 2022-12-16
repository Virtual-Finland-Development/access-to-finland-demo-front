import { useQuery } from '@tanstack/react-query';

// types
import { CountryOption } from '../../../@types';

// api
import api from '../../../api';

export default function useCountries() {
  const countriesQuery = useQuery(
    ['countries'],
    async () => {
      const response = await api.user.getCountries();
      return response.data as CountryOption[];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return countriesQuery;
}
