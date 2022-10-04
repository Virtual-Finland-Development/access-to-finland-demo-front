import { Flex, Heading, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// context
import { useAppContext } from '../../context/AppContext';

// components
import ProfileForm from '../ProfileForm/ProfileForm';

export default function Profile() {
  const { logIn } = useAppContext();
  const navigate = useNavigate();

  const onProfileSubmit = () => {
    logIn();
    navigate('/');
  };

  const onCancel = () => {
    logIn();
    navigate('/');
  };

  return (
    <Stack
      spacing={4}
      w="full"
      maxW="md"
      bg="white"
      rounded="xl"
      boxShadow="lg"
      p={6}
      my={12}
      mx={{ base: 4, md: 0 }}
    >
      <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        Fill in your profile
      </Heading>
      <ProfileForm onProfileSubmit={onProfileSubmit} onCancel={onCancel} />
    </Stack>
  );
}
