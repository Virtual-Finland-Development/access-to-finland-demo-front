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
    [
      'jobPostings',
      payload?.query,
      payload?.location?.countries,
      payload?.location?.municipalities,
      payload?.location?.regions,
      payload?.paging?.items_per_page,
    ],
    async ({ pageParam = 1 }) => {
      if (!payload) return;
      const response = await api.data.getJobPostings({
        ...payload,
        paging: { ...payload.paging, page_number: pageParam - 1 },
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
            lastPage.results.length < payload.paging.items_per_page
          ) {
            console.log(lastPage.results);
            console.log(payload.paging.items_per_page);
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
