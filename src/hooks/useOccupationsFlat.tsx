import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useOccupationsFlat() {
  const occupationsFlatQuery = useQuery(
    ['occupations-flat'],
    async () => {
      const occupations = await api.user.getOccupationsFlat();
      return occupations;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch occupations flat',
    error: occupationsFlatQuery.error,
  });

  return occupationsFlatQuery;
}
