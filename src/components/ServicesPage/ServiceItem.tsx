import { Stack, Link, Flex, Text, Progress } from '@chakra-ui/react';
import {
  InfoIcon,
  WarningIcon,
  SettingsIcon,
  QuestionIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

// types
import { StatusValue } from '../../@types';

function getProgressSettings(status: string | undefined) {
  switch (status) {
    case StatusValue.SENT:
      return {
        progressValue: 100 / 3,
        progressColorScheme: 'orange',
        Icon: <InfoIcon color="orange.500" />,
      };
    case StatusValue.PROCESSING:
      return {
        progressValue: (100 / 3) * 2,
        progressColorScheme: 'blue',
        Icon: <SettingsIcon color="blue.500" />,
      };
    case StatusValue.WAITING_FOR_COMPLETION:
      return {
        progressValue: 75,
        progressColorScheme: 'teal',
        Icon: <WarningIcon color="teal.500" />,
      };
    case StatusValue.READY:
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

const statusInfo: Record<string, string> = {
  [StatusValue.SENT]: 'Registration sent, awaiting processing.',
  [StatusValue.PROCESSING]:
    'Your registration has been received and is being processed.',
  [StatusValue.READY]: 'Your registration has been received and is completed.',
  [StatusValue.WAITING_FOR_COMPLETION]:
    'Your registration has been received and is waiting for completion, please contact the service provider for further instructions.',
  '': 'Awaiting your actions.',
};

interface ServiceItemProps {
  service: {
    name: string;
    status: string;
    statusLabel: string;
    href: string;
    isDisabled: boolean;
  };
}

export default function ServiceItem(props: ServiceItemProps) {
  const {
    service: { name, status, statusLabel, href, isDisabled },
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
      <Stack
        bg="white"
        p={4}
        rounded="md"
        border="1px"
        borderColor="gray.200"
        spacing={1}
      >
        <Flex alignItems="center" gap={2}>
          {Icon}
          <Text fontWeight="semibold">{statusLabel || 'Pending'}</Text>
        </Flex>
        <Text fontSize="sm" mb={1}>
          {statusInfo[status]}
        </Text>
        <Progress
          size="md"
          colorScheme={progressColorScheme}
          value={progressValue}
        />
      </Stack>
    </Stack>
  );
}
