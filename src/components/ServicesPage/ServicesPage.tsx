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
  QuestionIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';
import { EXT_REGISTRATION_SERVICE_URL } from '../../api/endpoints';

const dummyItems = [
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

  return (
    <Container
      maxW={'3xl'}
      w="full"
      bg="white"
      rounded="lg"
      boxShadow="lg"
      py={6}
    >
      <Stack as={Box} spacing={6}>
        <Heading lineHeight={1.1} fontSize={{ base: 'xl', sm: '2xl' }}>
          Services
        </Heading>
        <Stack spacing={6}>
          <ServiceItem
            service={{
              name: 'Foreigner Registration',
              status: 'IN_PROGRESS',
              href: `${EXT_REGISTRATION_SERVICE_URL}/auth?provider=${provider}`,
              isDisabled: false,
            }}
          />

          {dummyItems.map(item => (
            <ServiceItem key={item.name} service={item} />
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

const statuses: Record<string, string> = {
  IN_PROGRESS: 'Sent, awaiting processing',
  COMPLETED: 'Completed',
  FAILED: 'Declined, please contact service provider for further instructions',
  CANCELLED:
    'Cancelled, please contact service provider for further instructions',
};

function ServiceItem(props: ServiceItemProps) {
  const {
    service: { name, status, href, isDisabled },
  } = props;

  const progressValue =
    isDisabled || !status ? 0 : status === 'IN_PROGRESS' ? 50 : 100;

  const Icon = isDisabled
    ? QuestionIcon
    : status === 'IN_PROGRESS'
    ? InfoIcon
    : WarningIcon;

  const iconColor = isDisabled
    ? 'gray.100'
    : status === 'IN_PROGRESS'
    ? 'orange.400'
    : 'red';

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
          <Icon boxSize="18px" color={iconColor} />
          <Text fontSize="sm">{statuses[status]}</Text>
        </Flex>
        <Progress
          colorScheme="orange"
          size="md"
          hasStripe
          value={progressValue}
        />
      </Stack>
    </Stack>
  );
}
