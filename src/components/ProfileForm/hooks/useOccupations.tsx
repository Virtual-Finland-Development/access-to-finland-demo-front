import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../../../@types';

// api
import api from '../../../api';

/**
 * Flatten all occupations and child occupations (narrower lists) as one list
 */
function flattenOccupations(
  occupation: OccupationOption,
  destArr: OccupationOption[]
) {
  destArr.push(occupation);

  if (occupation.narrower) {
    for (let childOccupation of occupation.narrower) {
      flattenOccupations(childOccupation, destArr);
    }
  }
}

export default function useOccupations() {
  const countriesQuery = useQuery(
    ['occupations'],
    async () => {
      const response = await api.user.getOccupations();
      return response.data as OccupationOption[];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  /**
   * Flatten occupations from hierarchy level to one level array
   */
  const flattenedOccupations = useMemo(() => {
    if (!countriesQuery.data) return null;

    let destArr: OccupationOption[] = [];

    for (let occupation of countriesQuery.data) {
      flattenOccupations(occupation, destArr);
    }

    return destArr;
  }, [countriesQuery.data]);

  return { ...countriesQuery, flattenedOccupations };
}
