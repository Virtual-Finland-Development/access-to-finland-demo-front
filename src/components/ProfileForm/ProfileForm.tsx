import {
  useEffect,
  useState,
  useCallback,
  KeyboardEventHandler,
  useMemo,
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage as HookFormError } from '@hookform/error-message';
import { format, parseISO, isMatch } from 'date-fns';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  FormErrorMessage,
  Divider,
  Checkbox,
  useToast,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import {
  Select,
  CreatableSelect,
  OptionBase,
  GroupBase,
  SingleValue,
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

// hooks
import useCountries from './hooks/useCountries';
import useOccupations from './hooks/useOccupations';
import useLanguages from './hooks/useLanguages';

// components
import Loading from '../Loading/Loading';

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

  // User api provided lists and metadata
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const listsLoading =
    countriesLoading || occupationsLoading || languagesLoading;

  const isNewProfile =
    !(created && modified) || isNewUser({ created, modified });

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UserProfile>({
    mode: 'onSubmit',
    defaultValues: !isNewProfile
      ? {
          ...restOfProfile,
          dateOfBirth: restOfProfile.dateOfBirth
            ? format(parseISO(restOfProfile.dateOfBirth), 'yyyy-MM-dd')
            : null,
        }
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
    register('countryOfBirthCode');
    register('occupationCode');
    register('nationalityCode');
    register('nativeLanguageCode');
  }, [register]);

  // watch field values
  const {
    jobTitles,
    regions,
    jobsDataConsent,
    countryOfBirthCode,
    nationalityCode,
    nativeLanguageCode,
    occupationCode,
  } = watch();

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

  // Default value for 'ountryOfBirthCode', mapped as react-select option (in array)
  const defaultCountryOfBirthCode = useMemo(() => {
    if (!countries || !countryOfBirthCode) return null;

    return countries
      .filter(c => c.id === countryOfBirthCode)
      .map(c => ({
        label: c.englishName,
        value: c.id,
      }));
  }, [countries, countryOfBirthCode]);

  // Default value for 'nationalityCode', mapped as react-select option (in array)
  const defaultNationalityCode = useMemo(() => {
    if (!countries || !nationalityCode) return null;

    return countries
      .filter(c => c.id === nationalityCode)
      .map(c => ({
        label: c.englishName,
        value: c.id,
      }));
  }, [countries, nationalityCode]);

  // Default value for 'nativeLanguageCode', mapped as react-select option (in array)
  const defaultNativeLanguageCode = useMemo(() => {
    if (!languages || !nativeLanguageCode) return null;

    return languages
      .filter(l => l.id === nativeLanguageCode)
      .map(l => ({
        label: l.englishName,
        value: l.id,
      }));
  }, [languages, nativeLanguageCode]);

  // Default value for 'occupationCode', mapped as react-select option (in array)
  const defaultOccupationCode = useMemo(() => {
    if (!occupations || !occupationCode) return null;

    return occupations
      .filter(o => o.id === occupationCode)
      .map(o => ({
        label: o.name.en,
        value: o.id,
      }));
  }, [occupationCode, occupations]);

  /**
   * Handle form submit.
   */
  const onSubmit = useCallback(
    async (values: any) => {
      try {
        let payload: Partial<UserProfile> = {};
        const dirtyKeys = Object.keys(dirtyFields);

        // if new profile, set names, address as a minimum payload (pre-populated values)
        if (isNewProfile) {
          const { firstName, lastName, address } = values;
          payload = {
            firstName,
            lastName,
            address,
          };
        }

        // loop trough all dirty input values, set to payload
        if (dirtyKeys.length) {
          for (const key of dirtyKeys) {
            if (values[key]) {
              payload[key as keyof UserProfile] = values[key];
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
      } catch (error: any) {
        toast({
          title: error?.title || 'Error.',
          description:
            error?.detail || 'Something went wrong, please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [dirtyFields, isNewProfile, onProfileSubmit, setUserProfile, toast]
  );

  /**
   * Handle single select input changes.
   */
  const handleSingleSelectChange = (
    selected: SingleValue<Option>,
    meta: ActionMeta<Option>
  ) => {
    const field = meta.name as
      | 'countryOfBirthCode'
      | 'nationalityCode'
      | 'occupationCode';

    if (errors?.[`${field}`]) {
      clearErrors(field);
    }

    setValue(field, selected?.value || '', { shouldDirty: true });
  };

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

  if (listsLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
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
              name="firstName"
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
        </Flex>
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
            name="address"
          />
        </FormControl>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup onChange={onChange} value={value}>
                  <Stack direction="row">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </Stack>
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl
            isInvalid={Boolean(errors?.dateOfBirth)}
            id="dateOfBirth"
          >
            <FormLabel>Date of birth</FormLabel>
            <Input
              type="date"
              {...register('dateOfBirth', {
                validate: value => {
                  if (value && !isMatch(value, 'yyyy-MM-dd')) {
                    return 'Incorrect value';
                  }
                  return true;
                },
              })}
            />
            <HookFormError
              errors={errors}
              as={<FormErrorMessage />}
              name="dateOfBirth"
            />
          </FormControl>
        </Flex>
        {countries && (
          <>
            <FormControl
              isInvalid={Boolean(errors?.countryOfBirthCode)}
              id="countryOfBirthCode"
            >
              <FormLabel>Country of birth</FormLabel>
              <Select<Option, false, GroupBase<Option>>
                isMulti={false}
                name="countryOfBirthCode"
                defaultValue={defaultCountryOfBirthCode}
                options={countries.map(c => ({
                  label: c.englishName,
                  value: c.id,
                }))}
                placeholder="Type or select..."
                closeMenuOnSelect={true}
                size="md"
                onChange={handleSingleSelectChange}
              />
            </FormControl>

            <FormControl
              isInvalid={Boolean(errors?.countryOfBirthCode)}
              id="nationalityCode"
            >
              <FormLabel>Nationality</FormLabel>
              <Select<Option, false, GroupBase<Option>>
                isMulti={false}
                name="nationalityCode"
                defaultValue={defaultNationalityCode}
                options={countries.map(c => ({
                  label: c.englishName,
                  value: c.id,
                }))}
                placeholder="Type or select..."
                closeMenuOnSelect={true}
                size="md"
                onChange={handleSingleSelectChange}
              />
            </FormControl>
          </>
        )}
        {languages && (
          <FormControl
            isInvalid={Boolean(errors?.nativeLanguageCode)}
            id="nativeLanguageCode"
          >
            <FormLabel>Native language</FormLabel>
            <Select<Option, false, GroupBase<Option>>
              isMulti={false}
              name="nativeLanguageCode"
              defaultValue={defaultNativeLanguageCode}
              options={languages.map(l => ({
                label: l.englishName,
                value: l.id,
              }))}
              placeholder="Type or select..."
              closeMenuOnSelect={true}
              size="md"
              onChange={handleSingleSelectChange}
            />
          </FormControl>
        )}
        {occupations && (
          <FormControl
            isInvalid={Boolean(errors?.occupationCode)}
            id="occupationCode"
          >
            <FormLabel>Occupation</FormLabel>
            <Select<Option, false, GroupBase<Option>>
              isMulti={false}
              name="occupationCode"
              defaultValue={defaultOccupationCode}
              options={occupations.map(o => ({
                label: o.name.en,
                value: o.id,
              }))}
              placeholder="Type or select..."
              closeMenuOnSelect={true}
              size="md"
              onChange={handleSingleSelectChange}
            />
          </FormControl>
        )}
        <FormControl isInvalid={Boolean(errors?.jobTitles)} id="jobTitles">
          <FormLabel>Job titles or job tasks you are looking for</FormLabel>
          <CreatableSelect<Option, true, GroupBase<Option>>
            isMulti
            isClearable
            menuIsOpen={false}
            name="jobTitles"
            placeholder="Type to add and press enter..."
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
            placeholder="Type or select..."
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
        {isEdit && (
          <FormControl id="jobsDataConsent">
            <FormLabel>Profile consent</FormLabel>
            <Checkbox
              {...register('jobsDataConsent')}
              defaultChecked={jobsDataConsent}
            >
              I permit my profile data to be used in vacancies search
            </Checkbox>
            <FormHelperText>
              Your profile information will be used to improve search
              capabilities in a third party service.
            </FormHelperText>
          </FormControl>
        )}
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
