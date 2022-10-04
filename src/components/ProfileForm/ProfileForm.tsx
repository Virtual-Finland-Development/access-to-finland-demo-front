import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import { Select, OptionBase, GroupBase, MultiValue } from 'chakra-react-select';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  languages: string[];
}

interface LanguageOption extends OptionBase {
  label: string;
  value: string;
}

const languageOptions = [
  { value: 'fi', label: 'Finnish' },
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Swedish' },
];

interface ProfileFormProps {
  onProfileSubmit: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { onProfileSubmit, onCancel, isEdit } = props;
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({
    mode: 'onSubmit',
    /* defaultValues: {}, */
  });

  /**
   * Custom register languages.
   */
  useEffect(() => {
    register('languages', { required: 'Language is required' });
  }, [register]);

  const onSubmit = async (values: Partial<UserProfile>) => {
    console.log(values);
    onProfileSubmit();
  };

  /**
   * Handle icon change
   */
  const handleLanguagesChange = (selections: MultiValue<LanguageOption>) => {
    if (errors?.languages) {
      clearErrors('languages');
    }

    setValue(
      'languages',
      selections.map(s => s.value),
      { shouldDirty: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl
          isInvalid={Boolean(errors?.firstName)}
          id="firstName"
          // isRequired
        >
          <FormLabel>First name</FormLabel>
          <Input
            type="text"
            placeholder="John"
            _placeholder={{ color: 'gray.500' }}
            {...register('firstName', {
              required: 'First name is required',
            })}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="firstName"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.lastName)}
          id="lastName"
          // isRequired
        >
          <FormLabel>Last name</FormLabel>
          <Input
            type="text"
            placeholder="Doe"
            _placeholder={{ color: 'gray.500' }}
            {...register('lastName', {
              required: 'Last name is required',
            })}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="lastName"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.email)}
          id="email" /* isRequired */
        >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="john-doe@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="email"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.phone)}
          id="phone" /* isRequired */
        >
          <FormLabel>Phone number</FormLabel>
          <Input
            placeholder="international (+358 409275924)"
            _placeholder={{ color: 'gray.500' }}
            type="tel"
            {...register('phone', { required: 'Phone is required' })}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="phone"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.languages)}
          id="languages" /* isRequired */
        >
          <FormLabel>Languages</FormLabel>
          <Select<LanguageOption, true, GroupBase<LanguageOption>>
            isMulti
            name="languages"
            options={languageOptions}
            placeholder="Choose languages..."
            closeMenuOnSelect={false}
            size="md"
            onChange={handleLanguagesChange}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="phone"
          />
        </FormControl>
        <Divider />
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            {...(!isEdit && {
              bg: 'red.400',
              color: 'white',
              _hover: { bg: 'red.500' },
            })}
            w="full"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {!isEdit ? 'Skip' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
