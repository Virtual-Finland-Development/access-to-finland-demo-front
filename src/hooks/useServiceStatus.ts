import { useQuery } from '@tanstack/react-query';

// hooks
import useErrorToast from './useErrorToast';

// api
import api from '../api';

export default function useServiceStatus() {
  const query = useQuery(
    ['service-status'],
    async () => await api.data.getServiceStatus(),
    {
      refetchOnWindowFocus: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch service status',
    error: query.error,
  });

  return query;
}
