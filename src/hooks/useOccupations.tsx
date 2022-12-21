import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../@types';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

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
  const occupationsQuery = useQuery(
    ['occupations'],
    async () => {
      const occupations = await api.user.getOccupations();
      return occupations;
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
    if (!occupationsQuery.data) return null;

    let flattenedOccupations: OccupationOption[] = [];

    for (let occupation of occupationsQuery.data) {
      flattenOccupations(occupation, flattenedOccupations);
    }

    const occupationsMostInnerDepth = getOccupationsMostInnerDepth(
      occupationsQuery.data
    );

    return { flattenedOccupations, occupationsMostInnerDepth };
  }, [occupationsQuery.data]);

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch occupations',
    error: occupationsQuery.error,
  });

  return { ...occupationsQuery, ...flattenAndGetMostInnerDepth };
}
