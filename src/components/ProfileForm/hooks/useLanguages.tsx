import { useQuery } from '@tanstack/react-query';

// types
import { LanguageOption } from '../../../@types';

// api
import api from '../../../api';

export default function useLanguages() {
  const countriesQuery = useQuery(['languages'], async () => {
    const response = await api.user.getLanguages();
    return response.data as LanguageOption[];
  });

  return countriesQuery;
}
