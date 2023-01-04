import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage as HookFormError } from '@hookform/error-message';
import { format, isMatch, parseISO } from 'date-fns';
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  ActionMeta,
  CreatableSelect,
  GroupBase,
  MultiValue,
  Select,
  SingleValue,
} from 'chakra-react-select';

// types
import { Gender, UserProfile, UserOccupationSelection } from '../../@types';
import { RegionSelectOption, RegionType, SelectOption } from './types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';
import { useModal } from '../../context/ModalContext/ModalContext';

// utils
import { isNewUser } from '../../utils';

// profile form context utils
import {
  pickRandomAddress,
  pickRandomName,
  formatAddress,
  createOption,
  getDefaultSelectOption,
  getDefaultRegionOptions,
  groupedRegionOptions,
  handleOccupationsForPayload,
} from './utils';

// hooks
import useCountries from '../../hooks/useCountries';
import useOccupationsFlat from '../../hooks/useOccupationsFlat';
import useLanguages from '../../hooks/useLanguages';

// components
import Fieldset from '../Fieldset/Fieldset';
import Loading from '../Loading/Loading';
// import OccupationsSelect from '../OccupationFilters/OccupationsSelect';
import JmfRecommendationsSelect from '../JmfRecommendationsSelect/JmfRecommendationsSelect';
import UserOccupations from './UserOccupations';

// api
import api from '../../api';

interface ProfileFormProps {
  onProfileSubmit?: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { userProfile, setUserProfile } = useAppContext();
  const { openModal, closeModal } = useModal();
  const { id: userId, created, modified, ...restOfProfile } = userProfile;
  const { onProfileSubmit, isEdit } = props;

  const [jobTitlesInputValue, setJobTitlesInputValue] = useState<string>('');

  // User api provided lists and metadata
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: flattenedOccupations, isLoading: occupationsFlatLoading } =
    useOccupationsFlat();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const listsLoading =
    countriesLoading || occupationsFlatLoading || languagesLoading;

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
    register('citizenshipCode');
    register('nativeLanguageCode');
    register('address');
    register('occupations');
    register('workPreferences');
  }, [register]);

  // watch field values
  const {
    jobTitles,
    jobsDataConsent,
    countryOfBirthCode,
    citizenshipCode,
    nativeLanguageCode,
    address,
    occupations: userOccupations,
    workPreferences,
  } = watch();

  // Get default values for regions select, if provided in userProfile (workPreferences).
  const regionsDefaultOptions = useMemo(() => {
    if (!userId) return [];
    return getDefaultRegionOptions(workPreferences);
  }, [workPreferences, userId]);

  // Default countryOfBirthCode option
  const defaultCountryOfBirthOption = useMemo(
    () =>
      getDefaultSelectOption(
        countryOfBirthCode,
        countries,
        'id',
        'englishName'
      ),
    [countries, countryOfBirthCode]
  );

  // Default citizenshipCode option
  const defaultCitizenshipOption = useMemo(
    () =>
      getDefaultSelectOption(citizenshipCode, countries, 'id', 'englishName'),
    [citizenshipCode, countries]
  );

  // Default nativeLanguageCode option
  const defaultNativeLanguageOption = useMemo(
    () =>
      getDefaultSelectOption(
        nativeLanguageCode,
        languages,
        'id',
        'englishName'
      ),
    [languages, nativeLanguageCode]
  );

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

        // loop through all dirty input values, set to payload
        if (dirtyKeys.length) {
          for (const key of dirtyKeys) {
            if (key === 'occupations') {
              const modifiedOccupations = handleOccupationsForPayload(
                values.occupations,
                userProfile.occupations || []
              );

              if (modifiedOccupations.length) {
                payload.occupations = modifiedOccupations;
              }
            } else if (typeof values[key] === 'boolean' || values[key]) {
              payload[key as keyof UserProfile] = values[key];
            }
          }
        }

        const response = await api.user.patch(payload);

        // update occupations to form-hook state without dirtying, if payload includes occupation changes
        if (payload.occupations) {
          setValue('occupations', response.data.occupations, {
            shouldDirty: false,
          });
        }

        setUserProfile(response.data);

        if (typeof onProfileSubmit === 'function') {
          onProfileSubmit();
        }

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
    [
      dirtyFields,
      isNewProfile,
      onProfileSubmit,
      setUserProfile,
      setValue,
      toast,
      userProfile.occupations,
    ]
  );

  /**
   * Handle single select input changes.
   */
  const handleSingleSelectChange = (
    selected: SingleValue<SelectOption>,
    meta: ActionMeta<SelectOption>
  ) => {
    const field = meta.name as 'countryOfBirthCode' | 'citizenshipCode';

    if (errors?.[`${field}`]) {
      clearErrors(field);
    }

    setValue(field, selected?.value || '', { shouldDirty: true });
  };

  /**
   * Handle multi select input changes.
   */
  const handleMultiSelectChange = (
    selections: MultiValue<SelectOption>,
    meta: ActionMeta<SelectOption>
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
   * Handle workPreferences region / municipality changes
   */
  const handleRegionsSelectChange = (
    selections: MultiValue<RegionSelectOption>
  ) => {
    const regions = selections
      .filter(s => s.type === RegionType.REGION)
      .map(r => r.value);
    const municipalities = selections
      .filter(s => s.type === RegionType.MUNICIPALITY)
      .map(m => m.value);

    setValue('workPreferences.preferredRegionEnum', regions, {
      shouldDirty: true,
    });
    setValue('workPreferences.preferredMunicipalityEnum', municipalities, {
      shouldDirty: true,
    });
  };

  /**
   * Handle key down event for job titles input. Update values to hook-form state by jobTitlesInputValue.
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

  /**
   * Handle open jmf occupations / skills selection
   */
  const handleOpenRecommendationsSelect = () =>
    openModal({
      title: 'Knowledge and skills recommendations',
      content: (
        <JmfRecommendationsSelect
          onSelect={(selected: string[]) => {
            const previousTitles = jobTitles ? jobTitles : [];
            const newTitles = new Set([...previousTitles, ...selected]);
            setValue('jobTitles', Array.from(newTitles), { shouldDirty: true });
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
      onClose: () => {},
    });

  /**
   * Handle set changed occupations to hook-form state
   */
  const handleOccupationsChange = useCallback(
    (changedOccupations: UserOccupationSelection[]) => {
      setValue('occupations', changedOccupations, { shouldDirty: true });
    },
    [setValue]
  );

  if (listsLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Fieldset title="Personal information">
            <Stack spacing={4}>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl
                  isInvalid={Boolean(errors?.firstName)}
                  id="firstName"
                >
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
                <FormControl
                  isInvalid={Boolean(errors?.lastName)}
                  id="lastName"
                >
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
              <FormControl id="address">
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Address"
                  _placeholder={{ color: 'gray.500' }}
                  defaultValue={formatAddress(address)}
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
                          <Radio value={Gender.Male}>Male</Radio>
                          <Radio value={Gender.Female}>Female</Radio>
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
                    <Select<SelectOption, false, GroupBase<SelectOption>>
                      isMulti={false}
                      name="countryOfBirthCode"
                      defaultValue={defaultCountryOfBirthOption}
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
                    isInvalid={Boolean(errors?.citizenshipCode)}
                    id="citizenshipCode"
                  >
                    <FormLabel>Citizenship</FormLabel>
                    <Select<SelectOption, false, GroupBase<SelectOption>>
                      isMulti={false}
                      name="citizenshipCode"
                      defaultValue={defaultCitizenshipOption}
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
                  <Select<SelectOption, false, GroupBase<SelectOption>>
                    isMulti={false}
                    name="nativeLanguageCode"
                    defaultValue={defaultNativeLanguageOption}
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
            </Stack>
          </Fieldset>

          <Fieldset title="Search profile">
            <Stack spacing={4}>
              <FormControl
                isInvalid={Boolean(errors?.jobTitles)}
                id="jobTitles"
              >
                <FormLabel>
                  Job titles or job tasks you are looking for
                </FormLabel>
                <CreatableSelect<SelectOption, true, GroupBase<SelectOption>>
                  isMulti
                  isClearable
                  menuIsOpen={false}
                  name="jobTitles"
                  placeholder="Type to add and press enter..."
                  components={{ DropdownIndicator: null }}
                  formatCreateLabel={(inputValue: string) => (
                    <>Add "{inputValue}"</>
                  )}
                  inputValue={jobTitlesInputValue}
                  value={jobTitles ? jobTitles.map(v => createOption(v)) : []}
                  onChange={handleMultiSelectChange}
                  onInputChange={(value: string) =>
                    setJobTitlesInputValue(value)
                  }
                  onKeyDown={handleJobTitlesKeyDown}
                />
                <Link
                  color="blue.500"
                  fontWeight="medium"
                  fontSize="sm"
                  onClick={handleOpenRecommendationsSelect}
                >
                  Ask for recommendations
                </Link>
              </FormControl>
              {flattenedOccupations && (
                <FormControl
                  isInvalid={Boolean(errors?.occupations)}
                  id="occupations"
                >
                  <FormLabel>Occupations</FormLabel>
                  <UserOccupations
                    userOccupations={userOccupations}
                    occupationOptions={flattenedOccupations
                      .filter(o => o.notation.includes('.'))
                      .sort((a, b) => a.notation.localeCompare(b.notation))}
                    handleSave={handleOccupationsChange}
                  />
                </FormControl>
              )}
              <FormControl
                isInvalid={Boolean(
                  errors?.workPreferences?.preferredRegionEnum ||
                    errors?.workPreferences?.preferredMunicipalityEnum
                )}
                id="workPreferences"
              >
                <FormLabel>Preferred regions to work in</FormLabel>
                <Select<RegionSelectOption, true, GroupBase<RegionSelectOption>>
                  isMulti
                  name="workPreferences"
                  defaultValue={regionsDefaultOptions}
                  options={groupedRegionOptions}
                  placeholder="Type or select..."
                  closeMenuOnSelect={false}
                  size="md"
                  onChange={handleRegionsSelectChange}
                  menuPosition="fixed"
                  minMenuHeight={300}
                />
                <HookFormError
                  errors={errors}
                  as={<FormErrorMessage />}
                  name="workPreferences"
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
            </Stack>
          </Fieldset>
        </SimpleGrid>

        <Stack spacing={6} direction={['column', 'row']} justifyContent="end">
          <Button
            type="submit"
            bg="blue.400"
            color="white"
            _hover={{
              bg: 'blue.500',
            }}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save profile
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
