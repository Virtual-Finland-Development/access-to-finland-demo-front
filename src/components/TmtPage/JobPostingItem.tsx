import {
  Stack,
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

import mockData from './mockData.json';

export default function JobPostingItem({
  mockItem,
  index,
}: {
  mockItem: any;
  index: number;
}) {
  const item: JobPostingEntry = {
    ...mockData.results[index],
    employer: mockItem.name,
    location: {
      municipality: 'Helsinki',
      postcode: '000100',
    },
  };

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

  return (
    <Stack
      boxShadow="lg"
      mt="0"
      borderRadius="sm"
      bg="white"
      border="1px"
      borderColor="blue.100"
    >
      <Stack
        p="4"
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'start', md: 'end' }}
        justifyContent="space-between"
        bg="blue.100"
      >
        <Text fontWeight="semibold" color="blue.700">
          {item.basicInfo.title}
        </Text>
        <Badge variant="solid" colorScheme="blue">
          {item.basicInfo.workTimeType === '01' ? 'Full-time' : 'Part-time'}
        </Badge>
      </Stack>

      <Stack
        direction={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        p="4"
      >
        <Stack direction="column">
          <Text textAlign="left" maxW="4xl">
            {item.basicInfo.description}
          </Text>
          {host && (
            <Link href={item.applicationUrl} isExternal color="blue.400">
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
          <Text>
            <Icon as={IoCalendarOutline} />{' '}
            {format(parseISO(item.applicationEndDate), 'dd.MM.yyyy HH:mm')}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
