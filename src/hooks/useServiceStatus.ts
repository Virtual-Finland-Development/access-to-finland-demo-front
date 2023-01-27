import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useServiceStatus() {
  const [error, setError] = useState<any>(null);

  const query = useQuery(
    ['service-status'],
    async () => await api.data.getServiceStatus(),
    {
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error: any) => {
        if (
          error.response?.data?.data?.message &&
          error.response.data.data.message !== 'Status information not found'
        ) {
          setError(error);
        }
      },
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch service status',
    error: error,
  });

  return query;
}
