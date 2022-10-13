import {
  useEffect,
  useState,
  useCallback,
  KeyboardEventHandler,
  useMemo,
} from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage as HookFormError } from '@hookform/error-message';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  Divider,
  useToast,
} from '@chakra-ui/react';
import {
  Select,
  CreatableSelect,
  OptionBase,
  GroupBase,
  MultiValue,
  ActionMeta,
} from 'chakra-react-select';

// types
import { UserProfile } from '../../@types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// utils
import { isNewUser } from '../../utils';

// region selections
import regionsJson from '../TmtPage/regionJsons/regions.json';
import municipalitiesJson from '../TmtPage/regionJsons/municipalities.json';

// fake data lists
import firstNames from './fakeData/firstNames.json';
import lastNames from './fakeData/lastNames.json';
import addresses from './fakeData/addresses.json';

// api
import api from '../../api';

interface Option extends OptionBase {
  label: string;
  value: string;
}

const groupedRegionOptions = [
  {
    label: 'Regions',
    options: regionsJson.map(r => ({
      value: r.Koodi,
      label: r.Selitteet[2].Teksti,
    })),
  },
  {
    label: 'Municipalities',
    options: municipalitiesJson.map(m => ({
      value: m.Koodi,
      label: m.Selitteet[2].Teksti,
    })),
  },
];

const createOption = (label: string) => ({
  label,
  value: label,
});

const pickRandomName = (type: 'firstName' | 'lastName') => {
  const list: string[] = type === 'firstName' ? firstNames : lastNames;
  return list[Math.floor(Math.random() * list.length)] || type;
};

const pickRandomAddress = () => {
  const number = Math.floor(Math.random() * addresses.length);
  const address = addresses[number];
  return address
    ? `${number} ${address.detail} ${address.name}`
    : 'Random address 123';
};

interface ProfileFormProps {
  onProfileSubmit: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { userProfile, setUserProfile } = useAppContext();
  const { id: userId, created, modified, ...restOfProfile } = userProfile;
  const { onProfileSubmit, onCancel, isEdit } = props;

  const [jobTitlesInputValue, setJobTitlesInputValue] = useState<string>('');

  const isNewProfile =
    !(created && modified) || isNewUser({ created, modified });

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UserProfile>({
    mode: 'onSubmit',
    defaultValues: !isNewProfile
      ? { ...restOfProfile }
      : {
          firstName: pickRandomName('firstName'),
          lastName: pickRandomName('lastName'),
          address: pickRandomAddress(),
        },
  });

  const toast = useToast();

  /**
   * Custom register languages.
   */
  useEffect(() => {
    register('jobTitles');
    register('regions');
  }, [register]);

  // watch jobTitles value
  const { jobTitles, regions } = watch();

  /**
   * Get default values for regions select, if provided in userProfile.
   */
  const regionsDefaulOptions = useMemo(() => {
    if (!userId) return [];

    let options: Option[] = [];
    const selections = [...regionsJson, ...municipalitiesJson];

    if (regions?.length) {
      options = regions.reduce((acc: Option[], code) => {
        const selected = selections.find(s => s.Koodi === code);

        if (selected) {
          acc.push({
            value: selected.Koodi,
            label: selected.Selitteet[2].Teksti,
          });
        }

        return acc;
      }, []);
    }

    return options;
  }, [regions, userId]);

  /**
   * Handle form submit.
   */
  const onSubmit = useCallback(
    async (values: any) => {
      try {
        let payload: Partial<UserProfile> = {};
        const dirtyKeys = Object.keys(dirtyFields);

        if (isNewProfile) {
          payload = { ...values };
        } else {
          if (dirtyKeys.length) {
            for (const key of dirtyKeys) {
              if (values[key]) {
                payload[key as keyof UserProfile] = values[key];
              }
            }
          }
        }

        const response = await api.user.patch(payload);

        setUserProfile(response.data);

        onProfileSubmit();

        toast({
          title: 'Profile saved.',
          description: 'Your profile was updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error.',
          description: 'Something went wrong, please try again later.',
          status: 'error',
          duration: 50000,
          isClosable: true,
        });
      }
    },
    [dirtyFields, isNewProfile, onProfileSubmit, setUserProfile, toast]
  );

  /**
   * Handle multi select input changes.
   */
  const handleMultiSelectChange = (
    selections: MultiValue<Option>,
    meta: ActionMeta<Option>
  ) => {
    if (!meta.name) return;

    const field = meta.name as 'regions' | 'jobTitles';

    if (errors?.[`${field}`]) {
      clearErrors(field);
    }

    setValue(
      field,
      selections.map(s => s.value),
      { shouldDirty: true }
    );
  };

  /**
   * Handle key down evetn for job titles input. Update values to hook-form state by jobTitlesInputValue.
   */
  const handleJobTitlesKeyDown: KeyboardEventHandler<HTMLDivElement> =
    useCallback(
      event => {
        if (!jobTitlesInputValue) return;

        switch (event.key) {
          case 'Enter':
          case 'Tab':
            event.preventDefault();
            setJobTitlesInputValue('');
            const existingJobTitles = jobTitles || [];

            if (
              existingJobTitles.some(
                v => v.toLowerCase() === jobTitlesInputValue.toLowerCase()
              )
            ) {
              return;
            }

            setValue('jobTitles', [...existingJobTitles, jobTitlesInputValue], {
              shouldDirty: true,
            });
        }
      },
      [jobTitlesInputValue, jobTitles, setValue]
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={Boolean(errors?.firstName)} id="firstName">
          <FormLabel>First name</FormLabel>
          <Input
            type="text"
            placeholder="John"
            _placeholder={{ color: 'gray.500' }}
            {...register('firstName')}
            readOnly
          />
          <HookFormError
            errors={errors}
            as={<FormErrorMessage />}
            name="firstNames"
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors?.lastName)} id="lastName">
          <FormLabel>Last name</FormLabel>
          <Input
            type="text"
            placeholder="Doe"
            _placeholder={{ color: 'gray.500' }}
            {...register('lastName')}
            readOnly
          />
          <HookFormError
            errors={errors}
            as={<FormErrorMessage />}
            name="lastName"
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors?.address)} id="address">
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            placeholder="Address"
            _placeholder={{ color: 'gray.500' }}
            {...register('address')}
            readOnly
          />
          <HookFormError
            errors={errors}
            as={<FormErrorMessage />}
            name="lastName"
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors?.jobTitles)} id="jobTitles">
          <FormLabel>Job titles or job tasks</FormLabel>
          <CreatableSelect<Option, true, GroupBase<Option>>
            isMulti
            isClearable
            menuIsOpen={false}
            name="jobTitles"
            placeholder="Type to add..."
            components={{ DropdownIndicator: null }}
            formatCreateLabel={(inputValue: string) => <>Add "{inputValue}"</>}
            inputValue={jobTitlesInputValue}
            value={jobTitles ? jobTitles.map(v => createOption(v)) : []}
            onChange={handleMultiSelectChange}
            onInputChange={(value: string) => setJobTitlesInputValue(value)}
            onKeyDown={handleJobTitlesKeyDown}
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors?.regions)} id="regions">
          <FormLabel>Preferred regions to work in</FormLabel>
          <Select<Option, true, GroupBase<Option>>
            isMulti
            name="regions"
            defaultValue={regionsDefaulOptions}
            options={groupedRegionOptions}
            placeholder="Choose your preferred regions..."
            closeMenuOnSelect={false}
            size="md"
            onChange={handleMultiSelectChange}
          />
          <HookFormError
            errors={errors}
            as={<FormErrorMessage />}
            name="regions"
          />
        </FormControl>
        <Divider />
        <Stack spacing={6} direction={['column', 'row']}>
          {isEdit && (
            <Button
              /* {...(!isEdit && {
                bg: 'red.400',
                color: 'white',
                _hover: { bg: 'red.500' },
              })} */
              w="full"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              {!isEdit ? 'Skip' : 'Cancel'}
            </Button>
          )}
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
