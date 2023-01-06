import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function ConsentSentry({
  approveFunction,
  infoText,
}: {
  approveFunction: Function;
  infoText: string;
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleConsent = async () => {
    setIsSaving(true);

    try {
      await approveFunction();
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
        <Text color={'gray.500'}>{infoText}</Text>
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
