import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useJmfRecommendations(textContent: string) {
  const recommendationsQuery = useQuery(
    ['recommendations'],
    async () =>
      await api.data.getJmfRecommendations({
        text: textContent,
        maxNumberOfSkills: 20,
        maxNumberOfOccupations: 7,
        language: 'en',
      }),
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
