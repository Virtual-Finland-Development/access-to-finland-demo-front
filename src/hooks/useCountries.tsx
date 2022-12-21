import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useCountries() {
  const countriesQuery = useQuery(
    ['countries'],
    async () => {
      const countries = await api.user.getCountries();
      return countries;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch countries',
    error: countriesQuery.error,
  });

  return countriesQuery;
}
