import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useLanguages() {
  const languagesQuery = useQuery(
    ['languages'],
    async () => {
      const languages = await api.user.getLanguages();
      return languages;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch languages',
    error: languagesQuery.error,
  });

  return languagesQuery;
}
