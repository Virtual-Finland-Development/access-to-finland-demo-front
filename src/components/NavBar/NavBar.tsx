import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  VStack,
  Avatar,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { NavLink, useNavigate } from 'react-router-dom';

// types
import { AuthProvider } from '../../@types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import ProfileForm from '../ProfileForm/ProfileForm';

// api
import api from '../../api';

export default function WithSubnavigation() {
  const { userProfile } = useAppContext();
  const { firstName, lastName } = userProfile;

  const {
    isOpen: isOpenMobileNav,
    onToggle: onToggleMobileNav,
    onClose: onCloseMobileNav,
  } = useDisclosure();

  const { openModal, closeModal } = useModal();

  const navigate = useNavigate();

  /**
   * Handle open userProfile modal with useModal hook.
   */
  const openUserProfile = () =>
    openModal({
      title: 'Edit your profile',
      content: (
        <ProfileForm
          onProfileSubmit={closeModal}
          onCancel={closeModal}
          isEdit
        />
      ),
      onClose: () => {
        console.log('modal on close');
      },
    });

  /**
   * Handle log out click.
   */
  const handleLogOutClick = () => {
    // setIsLoading(true);

    const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER)!;
    api.auth.directToAuthGwLogout(provider as AuthProvider);
  };

  return (
    <>
      <Box>
        <Flex
          bgGradient="linear(to-r, blue.400, blue.600)"
          color="gray.600"
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          borderColor="gray.200"
          align="center"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggleMobileNav}
              icon={
                isOpenMobileNav ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant="ghost"
              color="white"
              aria-label="Toggle navigation"
            />
          </Flex>
          <Flex
            flex={{ md: 1 }}
            justify={{ base: 'center', md: 'start' }}
            alignItems="center"
          >
            <Flex
              flexDirection="column"
              alignItems="center"
              role="button"
              onClick={() => navigate('/')}
            >
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontSize="xl"
                fontFamily="monospace"
                fontWeight="bold"
                color="white"
              >
                Access to Finland
              </Text>
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontSize="md"
                fontFamily="monospace"
                fontWeight="bold"
                color="white"
              >
                Development
              </Text>
            </Flex>

            {/* <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                <DesktopNav />
              </Flex> */}
          </Flex>
          <Stack
            flex={{ base: 1, md: 1 }}
            justify="flex-end"
            direction="row"
            spacing={6}
          >
            <HStack spacing={{ base: '0', md: '6' }}>
              {/* <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<BellIcon />}
                color="white"
                _hover={{ color: 'black', bg: 'white' }}
              /> */}
              <Flex alignItems="center">
                <Menu>
                  <MenuButton
                    py={2}
                    transition="all 0.3s"
                    _focus={{ boxShadow: 'none' }}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        /* src={
                            'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                          } */
                        // name="John Doe"
                      />
                      <VStack
                        display={{ base: 'none', md: 'flex' }}
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2"
                      >
                        <Text fontSize="sm" color="white">
                          {firstName?.length && lastName?.length
                            ? `${firstName} ${lastName}`
                            : ''}
                        </Text>
                      </VStack>
                      <Box display={{ base: 'none', md: 'flex' }} color="white">
                        <ChevronDownIcon />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList bg="white" borderColor="gray.200">
                    <MenuItem onClick={openUserProfile}>Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogOutClick}>Sign out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HStack>
          </Stack>
        </Flex>

        <Flex
          display={{ base: 'none', md: 'flex' }}
          py={1}
          justifyContent="center"
          boxShadow="lg"
          borderBottomWidth={2}
          bgGradient="linear(to-r, blue.400, blue.600)"
        >
          <DesktopNav />
        </Flex>

        <Collapse in={isOpenMobileNav} animateOpacity>
          <MobileNav onClose={onCloseMobileNav} />
        </Collapse>
      </Box>
    </>
  );
}

const DesktopNav = () => {
  // const linkColor = useColorModeValue('gray.600', 'gray.200');
  // const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map(navItem => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <NavLink to={navItem.to ?? '#'}>
                {({ isActive }) => (
                  <Box
                    py={1}
                    px={4}
                    fontSize="xl"
                    fontWeight={500}
                    bg={isActive ? 'blue.700' : 'transparent'}
                    borderRadius="xl"
                    // color={isActive ? 'white' : 'black'}
                    color="white"
                    _hover={{
                      textDecoration: 'none',
                      bg: !isActive ? 'blue.600' : 'blue.700',
                      // color: isActive ? 'black' : 'blue.700', // linkHoverColor,
                      color: 'white',
                    }}
                  >
                    {navItem.label}
                  </Box>
                )}
              </NavLink>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map(child => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, to, subLabel }: NavItem) => {
  return (
    <Link
      href={to}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: 'pink.50' }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="pink.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  return (
    <Stack bg="white" p={4} display={{ md: 'none' }} borderBottomWidth={1}>
      {NAV_ITEMS.map(navItem => (
        <MobileNavItem
          key={navItem.label}
          navItem={navItem}
          onClose={onClose}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = (props: { navItem: NavItem; onClose: () => void }) => {
  const { navItem, onClose } = props;
  const { label, children, to } = navItem;
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <NavLink
          to={to ?? '#'}
          onClick={!children ? onClose : () => {}}
          style={{ width: '100%' }}
        >
          {({ isActive }) => (
            <Flex justify="space-between" align="center">
              <Text
                fontWeight={600}
                // color={useColorModeValue('gray.600', 'gray.200')}
                // color="gray.600"
                color={isActive ? 'blue.700' : 'gray.600'}
              >
                {label}
              </Text>
              {children && (
                <Icon
                  as={ChevronDownIcon}
                  transition="all .25s ease-in-out"
                  transform={isOpen ? 'rotate(180deg)' : ''}
                  w={6}
                  h={6}
                />
              )}
            </Flex>
          )}
        </NavLink>
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor="gray.200"
          align="start"
        >
          {children &&
            children.map(child => (
              <Link key={child.label} py={2} href={child.to}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  to?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Vacancies',
    to: '/vacancies',
    /* children: [
        {
          label: 'Sub page 1',
          subLabel: 'Lorem ipsum dolor sit amet',
          to: '#',
        },
        {
          label: 'Sub page 2',
          subLabel: 'Lorem ipsum dolor sit amet',
          to: '#',
        },
      ], */
  },
  {
    label: 'About',
    to: '/about',
  },
];
