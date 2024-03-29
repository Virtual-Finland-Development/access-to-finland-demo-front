import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

interface LimitOptions {
  maxNumberOfSkills: number;
  maxNumberOfOccupations: number;
}

export default function useJmfRecommendations(
  content: string | null,
  limitOptions: LimitOptions
) {
  const recommendationsQuery = useQuery(
    ['recommendations'],
    async () => {
      if (content) {
        return await api.data.getJmfRecommendations({
          text: content,
          language: 'en',
          ...limitOptions,
        });
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch recommendations',
    error: recommendationsQuery.error,
  });

  /**
   * Remove the query from cache on unmount.
   */
  useEffect(() => {
    return () => recommendationsQuery.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return recommendationsQuery;
}
