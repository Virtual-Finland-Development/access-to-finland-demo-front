import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

// types
import { JobPostingsRequestPayload, JobPostingsResponse } from '../types';

// api
import api from '../../../api';

export default function useJobPostings(
  payload: JobPostingsRequestPayload | null
) {
  const jobPostingsQuery = useInfiniteQuery(
    ['jobPostings'],
    async ({ pageParam = 1 }) => {
      if (!payload) return;

      const response = await api.data.getJobPostings({
        ...payload,
        // override payload.paging.pageNumber, set programmatically using usInfiniteQuery pageParam
        paging: { ...payload.paging, pageNumber: pageParam - 1 },
      });

      return response.data as JobPostingsResponse;
    },
    {
      enabled: Boolean(payload),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (_lastPage, pages) => {
        const lastPage = pages[pages.length - 1];

        if (lastPage && payload?.paging) {
          if (
            lastPage.results.length === 0 ||
            lastPage.results.length < payload.paging.itemsPerPage
          ) {
            return undefined;
          }
        }

        return pages.length + 1;
      },
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
