import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { faker } from '@faker-js/faker';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import {
  Select,
  OptionBase,
  GroupBase,
  MultiValue,
  ActionMeta,
} from 'chakra-react-select';

// region selections
import regions from '../TmtPage/regionJsons/regions.json';
import municipalities from '../TmtPage/regionJsons/municipalities.json';

interface UserProfile {
  firstNames: string;
  familyNames: string;
  address: string;
  jobTitle: string[];
  languages: string[];
  regions: string[];
}

interface Option extends OptionBase {
  label: string;
  value: string;
}

const languageOptions = [
  { value: 'fi', label: 'Finnish' },
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Swedish' },
];

const groupedRegionOptions = [
  {
    label: 'Regions',
    options: regions.map(r => ({
      value: r.Koodi,
      label: r.Selitteet[2].Teksti,
    })),
  },
  {
    label: 'Municipalities',
    options: municipalities.map(m => ({
      value: m.Koodi,
      label: m.Selitteet[2].Teksti,
    })),
  },
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
    register('regions', { required: 'Regions required' });
  }, [register]);

  const onSubmit = async (values: Partial<UserProfile>) => {
    console.log(values);
    onProfileSubmit();
  };

  /**
   * Handle multi select changes-
   */
  const handleMultiSelectChange = (
    selections: MultiValue<Option>,
    meta: ActionMeta<Option>
  ) => {
    if (!meta.name) return;

    const field = meta.name as 'languages' | 'regions';

    if (errors?.[`${field}`]) {
      clearErrors(field);
    }

    setValue(
      field,
      selections.map(s => s.value),
      { shouldDirty: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl
          isInvalid={Boolean(errors?.firstNames)}
          id="firstNames"
          // isRequired
        >
          <FormLabel>First name</FormLabel>
          <Input
            type="text"
            placeholder="John"
            _placeholder={{ color: 'gray.500' }}
            {...register('firstNames', {
              required: 'First name is required',
            })}
            defaultValue={faker.name.firstName()}
            readOnly
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="firstNames"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.familyNames)}
          id="familyNames"
          // isRequired
        >
          <FormLabel>Last name</FormLabel>
          <Input
            type="text"
            placeholder="Doe"
            _placeholder={{ color: 'gray.500' }}
            {...register('familyNames', {
              required: 'Last name is required',
            })}
            defaultValue={faker.name.lastName()}
            readOnly
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="lastName"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.address)}
          id="address"
          // isRequired
        >
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            placeholder="Address"
            _placeholder={{ color: 'gray.500' }}
            {...register('address', {
              required: 'Address  sis required',
            })}
            defaultValue={faker.address.streetAddress()}
            readOnly
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="lastName"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.languages)}
          id="languages" /* isRequired */
        >
          <FormLabel>Languages</FormLabel>
          <Select<Option, true, GroupBase<Option>>
            isMulti
            name="languages"
            options={languageOptions}
            placeholder="Choose languages..."
            closeMenuOnSelect={false}
            size="md"
            onChange={handleMultiSelectChange}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="phone"
          />
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors?.regions)}
          id="regions" /* isRequired */
        >
          <FormLabel>Regions</FormLabel>
          <Select<Option, true, GroupBase<Option>>
            isMulti
            name="regions"
            options={groupedRegionOptions}
            placeholder="Choose your preferred regions..."
            closeMenuOnSelect={false}
            size="md"
            onChange={handleMultiSelectChange}
          />
          <ErrorMessage
            errors={errors}
            as={<FormErrorMessage />}
            name="regions"
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
