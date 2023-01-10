import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  SingleValue,
  AsyncSelect,
  InputActionMeta,
  chakraComponents,
} from 'chakra-react-select';
import { useToast } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import debounce from 'lodash.debounce';

// types
import { JmfRecommendation } from '../../@types';
import { SelectOption } from '../ProfileForm/types';

// api
import api from '../../api';

interface MoreRecommendationsProps {
  selected: (JmfRecommendation & { delete?: boolean })[];
  onChange: (selection: SingleValue<SelectOption>) => void;
}

/**
 * Customized components
 */
const customComponents = {
  LoadingIndicator: (props: any) => (
    <chakraComponents.LoadingIndicator color="blue.500" {...props} />
  ),
  Option: (props: any) => (
    <chakraComponents.Option {...props}>
      {props.children}
      {props.isSelected && <CheckIcon ml={2} color="blue.500" />}
    </chakraComponents.Option>
  ),
};

export default function MoreRecommendations(props: MoreRecommendationsProps) {
  const { selected, onChange } = props;

  const [asyncInputValue, setAsyncInputValue] = useState('');
  const [asyncInputCachedOptions, setAsyncInputCachedOptions] = useState<
    SelectOption[]
  >([]);

  const toast = useToast();

  /**
   * Handle load more recommendations (react-select async input)
   */
  const loadMoreRecommendations = useCallback(
    (inputValue: string, callback: (options: SelectOption[]) => void) => {
      api.data
        .getJmfRecommendations({
          text: inputValue,
          maxNumberOfOccupations: 100,
          maxNumberOfSkills: 1,
          language: 'en',
        })
        .then(response => {
          const occupations = response.occupations
            .filter(o => !selected.some(s => !s.delete && s.uri === o.uri))
            .map(o => ({
              label: o.label,
              value: o.uri,
            }));
          setAsyncInputCachedOptions(occupations);
          callback(occupations);
        })
        .catch((error: any) => {
          toast({
            title: 'Error.',
            description: error?.message || 'Unexpected error occured',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    },
    [selected, toast]
  );

  /**
   * Debounced handler
   */
  const loadMoreDebounced = useMemo(
    () => debounce(loadMoreRecommendations, 300),
    [loadMoreRecommendations]
  );

  /**
   * Async incput value change
   */
  const onAsyncInputChange = useCallback(
    (value: string, action: InputActionMeta) => {
      // update input value only on 'input-change' -action
      if (action.action === 'input-change') {
        setAsyncInputValue(value);
        // clear cached options / cancel debounced handler when input is empty
        if (!value.length) {
          setAsyncInputCachedOptions([]);
          loadMoreDebounced.cancel();
        }
      }
    },
    [loadMoreDebounced]
  );

  /**
   * Cancel debounce action on unmount
   */
  useEffect(() => {
    return () => loadMoreDebounced.cancel();
  }, [loadMoreDebounced]);

  return (
    <AsyncSelect
      isOptionSelected={option =>
        option
          ? selected.findIndex(s => !s.delete && s.uri === option.value) > -1
          : false
      }
      inputValue={asyncInputValue}
      value={null}
      menuPlacement="top"
      minMenuHeight={300}
      openMenuOnClick={true}
      controlShouldRenderValue={false}
      isClearable={false}
      closeMenuOnSelect={true}
      blurInputOnSelect={false}
      placeholder="Search..."
      cacheOptions={false}
      defaultOptions={asyncInputCachedOptions}
      loadOptions={loadMoreDebounced}
      components={customComponents}
      chakraStyles={{
        menuList: provided => ({
          ...provided,
          borderColor: '#3182ce',
          boxShadow: '0 0 0 1px #3182ce',
          borderWidth: '2px',
        }),
        loadingMessage: provided => ({
          ...provided,
          color: '#3182ce',
        }),
        option: (provided, state) => ({
          ...provided,
          color: '#000',
          backgroundColor: state.isFocused ? 'gray.100' : '#fff',
        }),
      }}
      onInputChange={onAsyncInputChange}
      onChange={onChange}
    />
  );
}
