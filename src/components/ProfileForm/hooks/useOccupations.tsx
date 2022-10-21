import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../../../@types';

// api
import api from '../../../api';

export default function useOccupations() {
  const countriesQuery = useQuery(['occupations'], async () => {
    const response = await api.user.getOccupations();
    return response.data as OccupationOption[];
  });

  return countriesQuery;
}
