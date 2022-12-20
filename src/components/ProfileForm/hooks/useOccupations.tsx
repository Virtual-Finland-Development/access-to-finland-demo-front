import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../../../@types';

// api
import api from '../../../api';

/**
 * Get the most inner depth of occupations narrower (hierarchived occupations)
 */
function getOccupationsMostInnerDepth(
  item: OccupationOption | OccupationOption[]
): number {
  return Array.isArray(item)
    ? 1 + Math.max(...item.map(getOccupationsMostInnerDepth))
    : Array.isArray(item.narrower)
    ? 1 + Math.max(...item.narrower.map(getOccupationsMostInnerDepth))
    : 0;
}

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
   * Flatten occupations from hierarchy level to one level array.
   * Also get the most inner depth of occupation.narrower level
   */
  const flattenAndGetMostInnerDepth = useMemo(() => {
    if (!countriesQuery.data) return null;

    let flattenedOccupations: OccupationOption[] = [];

    for (let occupation of countriesQuery.data) {
      flattenOccupations(occupation, flattenedOccupations);
    }

    const occupationsMostInnerDepth = getOccupationsMostInnerDepth(
      countriesQuery.data
    );

    return { flattenedOccupations, occupationsMostInnerDepth };
  }, [countriesQuery.data]);

  return { ...countriesQuery, ...flattenAndGetMostInnerDepth };
}
