import { Container, Stack, Heading, Box } from '@chakra-ui/react';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';
import { EXT_REGISTRATION_SERVICE_URL } from '../../api/endpoints';

// hooks
import useServiceStatus from '../../hooks/useServiceStatus';

// components
import ServiceItem from './ServiceItem';
import Loading from '../Loading/Loading';

const dummyServices = [
  {
    name: 'Service 2',
    status: '',
    href: '',
    isDisabled: true,
  },
  {
    name: 'Service 3',
    status: '',
    href: '',
    isDisabled: true,
  },
  {
    name: 'Service 4',
    status: '',
    href: '',
    isDisabled: true,
  },
];

export default function ServicesPage() {
  const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);

  const { data: status, isLoading } = useServiceStatus();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      maxW={'3xl'}
      w="full"
      bg="white"
      rounded="lg"
      boxShadow="lg"
      py={6}
      mb={6}
    >
      <Stack as={Box} spacing={6}>
        <Heading lineHeight={1.1} fontSize={{ base: 'xl', sm: '2xl' }}>
          Services
        </Heading>
        <Stack spacing={6}>
          <ServiceItem
            service={{
              name: 'Foreigner Registration',
              status: status?.statusValue || '',
              href: `${EXT_REGISTRATION_SERVICE_URL}/auth?provider=${provider}`,
              isDisabled: false,
            }}
          />

          {dummyServices.map(service => (
            <ServiceItem key={service.name} service={service} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
