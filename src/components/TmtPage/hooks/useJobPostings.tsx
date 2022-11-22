import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// types
import { JobPostingsRequestPayload, JobPostingsResponse } from '../types';

// api
import api from '../../../api';

export default function useJobPostings(
  payload: JobPostingsRequestPayload | null
) {
  const jobPostingsQuery = useQuery(
    ['jobPostings'],
    async () => {
      if (!payload) return;
      const response = await api.data.getJobPostings(payload);
      return response.data as JobPostingsResponse;
    },
    {
      keepPreviousData: true,
      enabled: Boolean(payload),
      refetchOnWindowFocus: false,
    }
  );

  /**
   * Remove the query from cache on unmount.
   */
  useEffect(() => {
    return () => jobPostingsQuery.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return jobPostingsQuery;
}
