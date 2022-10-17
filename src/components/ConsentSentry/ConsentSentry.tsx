import { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// api
import api from '../../api';

export default function ConsentSentry() {
  const { setUserProfile } = useAppContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const toast = useToast();

  /**
   * Handle 'jobsConsent' update for user profile.
   */
  const handleConsent = async () => {
    setIsSaving(true);

    try {
      const payload = { jobsDataConsent: true };
      const response = await api.user.patch(payload);

      setUserProfile(response.data);

      toast({
        title: 'Profile saved.',
        description: 'Your profile was updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error?.title || 'Error.',
        description:
          error?.detail || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 50000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxW={'3xl'}>
      <Stack as={Box} textAlign={'center'} spacing={{ base: 4, md: 10 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
        >
          Consent needed
        </Heading>
        <Text color={'gray.500'}>
          To continue to use vacancies search, you need to give your consent to
          use your profile information for search capabilities in third party
          service.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          <Button
            colorScheme={'blue'}
            bg={'blue.500'}
            // rounded={'full'}
            px={6}
            _hover={{
              bg: 'blue.600',
            }}
            onClick={handleConsent}
            isLoading={isSaving}
          >
            Approve
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
