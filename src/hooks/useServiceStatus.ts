import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

// only custom 'Status information not found' error should be silenced
function shouldShowError(error: any) {
  return (
    error.response.status !== 404 ||
    (error.message.status === 404 && !error?.response?.data?.data?.message) ||
    (error.response.data.data.message &&
      error.response.data.data.message !== 'Status information not found')
  );
}

export default function useServiceStatus() {
  const [error, setError] = useState<any>(null);

  const query = useQuery(
    ['service-status'],
    async () => await api.data.getServiceStatus(),
    {
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error: any) => {
        if (shouldShowError(error)) {
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
