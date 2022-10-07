import { ReactElement } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';

export default function ErrorMessage({
  error,
  addition,
}: {
  error: any;
  addition?: ReactElement;
}) {
  return (
    <Alert status="error">
      <AlertIcon />
      <Box>
        <AlertTitle>{error?.title || 'Error'}</AlertTitle>
        <AlertDescription>
          {error?.message || 'An unexpected error has occured.'}
          {addition && <Box mt={2}>{addition}</Box>}
        </AlertDescription>
      </Box>
    </Alert>
  );
}
