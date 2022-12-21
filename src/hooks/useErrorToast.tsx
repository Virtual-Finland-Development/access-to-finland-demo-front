import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';

export default function useErrorToast({
  title = 'Error',
  error,
}: {
  title: string;
  error: unknown;
}) {
  const toast = useToast();

  useEffect(() => {
    if (error) {
      const description =
        error instanceof AxiosError ? error.message : 'Something went wrong.';

      toast({
        title,
        description,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, title, toast]);

  return null;
}
