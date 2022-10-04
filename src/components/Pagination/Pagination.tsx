import { useEffect, ChangeEvent } from 'react';
import {
  Flex,
  Stack,
  Select,
  FormLabel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import {
  Pagination as AjnaPagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from '@ajna/pagination';

// utils
import { scrollToElement } from '../../utils';

export default function Pagination(props: any) {
  const { total, onPaginationStateChange } = props;

  const limits = useBreakpointValue(
    {
      base: {
        outer: 1,
        inner: 1,
      },
      md: {
        outer: 2,
        inner: 2,
      },
    },
    {
      fallback: 'md',
    }
  );

  const pagiNationWrapperWidth = useBreakpointValue(
    {
      base: '100%',
      md: '50%',
    },
    { fallback: 'md' }
  );

  const {
    pages,
    pagesCount,
    offset,
    currentPage,
    setCurrentPage,
    // setIsDisabled,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total,
    limits,
    initialState: {
      pageSize: 25,
      isDisabled: false,
      currentPage: 1,
    },
  });

  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
    scrollToElement(document.getElementById('root')!);
  };

  const handlePageSizeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    const pageSize = Number(event.target.value);
    setPageSize(pageSize);
  };

  useEffect(() => {
    onPaginationStateChange(offset, pageSize);
  }, [offset, onPaginationStateChange, pageSize]);

  return (
    <Flex flexDirection="column" justifyContent={'center'}>
      <Flex alignItems="center">
        <FormLabel>Results per page</FormLabel>
        <Select onChange={handlePageSizeChange} w={40} bg="white">
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
        </Select>
      </Flex>
      <Stack alignSelf={'center'} w={pagiNationWrapperWidth}>
        <AjnaPagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          isDisabled={isDisabled}
          onPageChange={handlePageChange}
        >
          <PaginationContainer
            align="center"
            justify="space-between"
            py={4}
            w="full"
          >
            <PaginationPrevious
              color="white"
              _hover={{
                bg: 'blue.600',
              }}
              bg="blue.500"
            >
              <ArrowLeftIcon fontSize="xs" />
            </PaginationPrevious>
            <PaginationPageGroup
              isInline
              align="center"
              separator={
                <PaginationSeparator
                  bg="blue.300"
                  color="white"
                  fontSize="sm"
                  w={7}
                  jumpSize={11}
                />
              }
            >
              {pages.map((page: number) => (
                <PaginationPage
                  w={7}
                  bg="white"
                  key={`pagination_page_${page}`}
                  page={page}
                  fontSize="sm"
                  _hover={{
                    bg: 'blue.500',
                    color: 'white',
                  }}
                  _current={{
                    bg: 'blue.600',
                    fontSize: 'sm',
                    color: 'white',
                    w: 7,
                  }}
                />
              ))}
            </PaginationPageGroup>
            <PaginationNext
              color="white"
              _hover={{
                bg: 'blue.600',
              }}
              bg="blue.500"
            >
              <ArrowRightIcon fontSize="xs" />
            </PaginationNext>
          </PaginationContainer>
        </AjnaPagination>
      </Stack>
    </Flex>
  );
}
