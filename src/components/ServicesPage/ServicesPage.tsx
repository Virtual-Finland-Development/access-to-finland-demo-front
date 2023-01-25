import {
  Container,
  Stack,
  Heading,
  Box,
  Link,
  Flex,
  Text,
  Progress,
} from '@chakra-ui/react';
import {
  InfoIcon,
  WarningIcon,
  SettingsIcon,
  QuestionIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';
import { EXT_REGISTRATION_SERVICE_URL } from '../../api/endpoints';

// hooks
import useServiceStatus from '../../hooks/useServiceStatus';

// components
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
              status: status.statusValue || '',
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

interface ServiceItemProps {
  service: {
    name: string;
    status: string;
    href: string;
    isDisabled: boolean;
  };
}

function getProgressSettings(status: string | undefined) {
  switch (status) {
    case 'SENT':
      return {
        progressValue: 100 / 3,
        progressColorScheme: 'orange',
        Icon: <InfoIcon color="orange.500" />,
      };
    case 'PROCESSING':
      return {
        progressValue: (100 / 3) * 2,
        progressColorScheme: 'blue',
        Icon: <SettingsIcon color="blue.500" />,
      };
    case 'WAITING_FOR_COMPLETION':
      return {
        progressValue: 75,
        progressColorScheme: 'teal',
        Icon: <WarningIcon color="teal.500" />,
      };
    case 'READY':
      return {
        progressValue: 100,
        progressColorScheme: 'green',
        Icon: <CheckCircleIcon color="green.500" />,
      };
    default:
      return {
        progressValue: 0,
        progressColorScheme: '',
        Icon: <QuestionIcon color="gray.200" />,
      };
  }
}

const statuses: Record<string, string> = {
  SENT: 'Sent, awaiting processing',
  READY: 'Completed',
  PROCESSING: 'Processing',
  WAITING_FOR_COMPLETION:
    'Awaiting for completion, please contact the service provider for further instructions',
  '': 'Awaiting your actions',
};

function ServiceItem(props: ServiceItemProps) {
  const {
    service: { name, status, href, isDisabled },
  } = props;

  const { progressValue, progressColorScheme, Icon } =
    getProgressSettings(status);

  return (
    <Stack bg="gray.100" p={6} rounded="md">
      <Link
        isExternal
        href={!isDisabled ? href : undefined}
        fontSize="xl"
        alignSelf="start"
        color={isDisabled ? 'gray.500' : 'blue.500'}
        {...(isDisabled && {
          _hover: { textDecoration: 'none', cursor: 'default' },
        })}
      >
        {name}
      </Link>
      <Stack bg="white" p={4} rounded="md" border="1px" borderColor="gray.200">
        <Flex alignItems="center" gap={2}>
          {Icon}
          <Text fontSize="sm">{statuses[status]}</Text>
        </Flex>
        <Progress
          size="md"
          hasStripe
          colorScheme={progressColorScheme}
          value={progressValue}
        />
      </Stack>
    </Stack>
  );
}
