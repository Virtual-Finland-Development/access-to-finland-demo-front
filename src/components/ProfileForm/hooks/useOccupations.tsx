import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../../../@types';

// api
import api from '../../../api';

function flattenOccupations(
  occupations: OccupationOption[],
  destArr: OccupationOption[]
) {
  for (let o of occupations) {
    destArr.push(o);
    if (o.narrower) flattenOccupations(o.narrower, destArr);
  }

  return destArr;
}

export default function useOccupations() {
  const countriesQuery = useQuery(['occupations'], async () => {
    const response = await api.user.getOccupations();
    return response.data as OccupationOption[];
  });

  /**
   * Flatten occupations from hierarchy level to one level array
   */
  const flattenedOccupations = useMemo(() => {
    if (!countriesQuery.data) return null;
    let destArr: OccupationOption[] = [];
    return flattenOccupations(countriesQuery.data, destArr);
  }, [countriesQuery.data]);

  return { ...countriesQuery, flattenedOccupations };
}
