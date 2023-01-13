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
   * Get the most inner depth of occupation.narrower level
   */
  const getMostInnerDepth = useMemo(() => {
    if (!occupationsQuery.data) return null;

    const occupationsMostInnerDepth = getOccupationsMostInnerDepth(
      occupationsQuery.data
    );

    return { occupationsMostInnerDepth };
  }, [occupationsQuery.data]);

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch occupations',
    error: occupationsQuery.error,
  });

  return { ...occupationsQuery, ...getMostInnerDepth };
}
