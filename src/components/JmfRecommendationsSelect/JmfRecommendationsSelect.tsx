import React, { useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormHelperText,
  Textarea,
  Flex,
  VStack,
  Stack,
  Text,
} from '@chakra-ui/react';

// types
import { JmfRecommendation } from '../../@types';

// hooks
import useJmfRecommendations from '../../hooks/useJmfRecommendations';

// components
import RecommendationItem from './RecommendationItem';
import Loading from '../Loading/Loading';

interface JmfRecommendationsSelectProps {
  onSelect: (selected: string[]) => void;
  onCancel: () => void;
}

export default function JmfRecommendationsSelect(
  props: JmfRecommendationsSelectProps
) {
  const { onSelect, onCancel } = props;
  const [textContent, setTextContent] = useState<string>('');
  const [selected, setSelected] = useState<JmfRecommendation[]>([]);

  /**
   * Recommendations query
   */
  const {
    data: recommendations,
    isFetching: recommendationsFetching,
    refetch: fetchRecommendations,
  } = useJmfRecommendations(textContent);

  /**
   * Handle save selected recommendations
   */
  const handleSaveSelections = useCallback(() => {
    onSelect(selected.map(s => s.label));
  }, [onSelect, selected]);

  /**
   * Handle select / de-select recommendation
   */
  const handleSelect = useCallback((recommendation: JmfRecommendation) => {
    setSelected(prev => {
      let selected = [...prev];
      const isSelected =
        selected.findIndex(s => s.uri === recommendation.uri) > -1;

      if (isSelected) {
        selected = selected.filter(s => s.uri !== recommendation.uri);
      } else {
        selected.push(recommendation);
      }

      return selected;
    });
  }, []);

  return (
    <React.Fragment>
      <VStack spacing={4}>
        <Box
          p={4}
          border="1px"
          borderRadius="base"
          borderColor="#DCDCDC"
          backgroundColor="blue.50"
          w="100%"
        >
          <Heading as="h5" size="sm">
            Please describe the skills related to the job you are looking for
          </Heading>
          <FormControl mt={2}>
            <Textarea
              size="sm"
              backgroundColor="white"
              value={textContent}
              onChange={({ target }) => setTextContent(target.value)}
            />
            <FormHelperText fontSize="xs">
              You will get keyword suggestions based on your text. Please choose
              the most suitable ones. Keywords are used for job recommendations.
            </FormHelperText>
          </FormControl>
          <Button
            mt={2}
            size="sm"
            colorScheme="teal"
            disabled={!textContent.length || recommendationsFetching}
            onClick={() => fetchRecommendations()}
          >
            Select keywords
          </Button>
        </Box>
        {recommendationsFetching && (
          <Flex minH="155px" alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        )}
        {!recommendationsFetching && recommendations && (
          <Stack
            p={4}
            spacing={6}
            border="1px"
            borderRadius="base"
            borderColor="#DCDCDC"
            w="100%"
            minH="155px"
          >
            <Stack>
              <Heading as="h5" size="sm">
                Suggested occupations
              </Heading>
              <Flex gap={2} flexWrap="wrap">
                {recommendations.occupations.length ? (
                  <React.Fragment>
                    {recommendations.occupations.map(item => (
                      <RecommendationItem
                        type="occupation"
                        key={item.uri}
                        item={item}
                        isSelected={
                          selected.findIndex(s => s.uri === item.uri) > -1
                        }
                        handleClick={() => handleSelect(item)}
                      />
                    ))}
                  </React.Fragment>
                ) : (
                  <Text fontSize="sm">No suggestions found</Text>
                )}
              </Flex>
            </Stack>
            <Stack>
              <Heading as="h5" size="sm">
                Suggested skills
              </Heading>
              <Flex gap={2} flexWrap="wrap">
                {recommendations.skills.length ? (
                  <React.Fragment>
                    {recommendations.skills.map(item => (
                      <RecommendationItem
                        type="skill"
                        key={item.uri}
                        item={item}
                        isSelected={
                          selected.findIndex(s => s.uri === item.uri) > -1
                        }
                        handleClick={() => handleSelect(item)}
                      />
                    ))}
                  </React.Fragment>
                ) : (
                  <Text fontSize="sm">No suggestions found</Text>
                )}
              </Flex>
            </Stack>
          </Stack>
        )}
      </VStack>
      <Stack
        mt={4}
        spacing={4}
        direction={['column', 'row']}
        justifyContent="end"
      >
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="submit"
          bg="blue.400"
          color="white"
          _hover={{
            bg: 'blue.500',
          }}
          disabled={!selected.length}
          onClick={handleSaveSelections}
        >
          Save selection
        </Button>
      </Stack>
    </React.Fragment>
  );
}
