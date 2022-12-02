import {
  Stack,
  Flex,
  Text,
  Link,
  Badge,
  Icon,
  Show,
  Divider,
} from '@chakra-ui/react';
import { IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';

// types
import { JobPostingEntry } from './types';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

export default function JobPostingItem({ item }: { item: JobPostingEntry }) {
  const { openModal } = useModal();

  const domain = item.applicationUrl
    ? new URL(
        item.applicationUrl.includes('http://') ||
        item.applicationUrl.includes('https://')
          ? item.applicationUrl
          : `https://${item.applicationUrl}`
      )
    : null;
  const host =
    item.applicationUrl && domain?.host
      ? domain.host.replace('www.', '')
      : null;

  const openDetails = () =>
    openModal({
      title: item.basicInfo.title,
      content: (
        <Stack direction="column">
          {item.basicInfo.description !== '-' && (
            <Text textAlign="left" maxW="4xl">
              {item.basicInfo.description}
            </Text>
          )}
          {host && (
            <Link href={item.applicationUrl} isExternal color="blue.400">
              {host}
            </Link>
          )}
        </Stack>
      ),
      onClose: () => {},
    });

  return (
    <Stack
      boxShadow="lg"
      mt="0"
      borderRadius="sm"
      bg="white"
      border="1px"
      borderColor="blue.100"
      onClick={openDetails}
      role="button"
    >
      <Stack
        p="4"
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'start', md: 'end' }}
        justifyContent="space-between"
        bg="blue.100"
      >
        <Text fontWeight="semibold" color="blue.700" alignSelf="start">
          {item.basicInfo.title}
        </Text>
        <Flex
          flexDirection="column"
          gap={2}
          alignItems={{ base: 'start', md: 'end' }}
        >
          <Badge variant="solid" colorScheme="purple">
            {item.jobsSource}
          </Badge>
          {['01', '02'].includes(item.basicInfo.workTimeType) && (
            <Badge variant="solid" colorScheme="blue">
              {item.basicInfo.workTimeType === '01' ? 'Full-time' : 'Part-time'}
            </Badge>
          )}
        </Flex>
      </Stack>

      <Stack
        direction={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        p="4"
      >
        <Stack direction="column">
          {item.basicInfo.description !== '-' && (
            <Text textAlign="left" maxW="4xl" noOfLines={5}>
              {item.basicInfo.description}
            </Text>
          )}
          {host && (
            <Link
              href={item.applicationUrl}
              isExternal
              color="blue.400"
              onClick={e => e.stopPropagation()}
            >
              {host}
            </Link>
          )}
        </Stack>
        <Show below="md">
          <Divider />
        </Show>
        <Stack direction="column" alignItems={{ md: 'end' }}>
          <Text fontWeight="semibold">
            {item.employer || 'Anonymous employer'}
          </Text>
          <Text>
            <Icon as={IoLocationOutline} />{' '}
            {item.location.municipality ? item.location.municipality : ''}
          </Text>
          {item.applicationEndDate && (
            <Text>
              <Icon as={IoCalendarOutline} />{' '}
              {format(parseISO(item.applicationEndDate), 'dd.MM.yyyy HH:mm')}
            </Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
