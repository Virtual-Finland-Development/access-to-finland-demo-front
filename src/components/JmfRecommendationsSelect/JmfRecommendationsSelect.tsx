import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  ChangeEvent,
} from 'react';
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
  Link,
  useToast,
} from '@chakra-ui/react';

// types
import { JmfRecommendation } from '../../@types';

// hooks
import useJmfRecommendations from '../../hooks/useJmfRecommendations';

// utils
import { extractPdfTextContent, convertRtfToPlainText } from './utils';

// components
import RecommendationItem from './RecommendationItem';
import MoreRecommendations from './MoreRecommendations';
import Loading from '../Loading/Loading';

const FILE_TYPES = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  rtf: 'text/rtf',
};

interface JmfRecommendationsSelectProps {
  type?: 'occupations' | 'skills' | 'both';
  isControlled: boolean;
  controlledSelected?: JmfRecommendation[];
  onSelect?: (selected: JmfRecommendation) => void;
  onSave: (selected?: JmfRecommendation[]) => void;
  onCancel: () => void;
}

export default function JmfRecommendationsSelect2(
  props: JmfRecommendationsSelectProps
) {
  const {
    type = 'both',
    isControlled,
    controlledSelected,
    onSelect,
    onSave,
    onCancel,
  } = props;
  const [textContent, setTextContent] = useState<string | null>('');
  const [extractedTextContent, setExtractedTextContent] = useState<
    string | null
  >('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selected, setSelected] = useState<
    (JmfRecommendation & { delete?: boolean })[]
  >([]);

  // file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  /**
   * Recommendations query
   */
  const {
    data: recommendations,
    isFetching: recommendationsFetching,
    refetch: fetchRecommendations,
  } = useJmfRecommendations(textContent || extractedTextContent, {
    maxNumberOfSkills: type === 'both' ? 20 : type === 'occupations' ? 1 : 20,
    maxNumberOfOccupations: type === 'both' ? 7 : type === 'skills' ? 1 : 20,
  });

  /**
   * Track extractedTextContent value and fetch recommendations when set
   */
  useEffect(() => {
    if (extractedTextContent && !textContent) {
      fetchRecommendations();
    }
  }, [extractedTextContent, fetchRecommendations, textContent]);

  /**
   * Track parent selected state, if component if controlled by parent
   */
  useEffect(() => {
    if (isControlled && controlledSelected) {
      setSelected(controlledSelected);
    }
  }, [isControlled, controlledSelected]);

  /**
   * Handle select / de-select recommendation
   * If component is controlled by parent update parent state, otherwise update inner state
   */
  const handleSelect = useCallback(
    (recommendation: JmfRecommendation) => {
      if (isControlled && typeof onSelect === 'function') {
        onSelect(recommendation);
        return;
      }

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
    },
    [isControlled, onSelect]
  );

  /**
   * Handle save selections
   * If controlled by parent, pass no input
   * Otherwise pass component inner selected state as input
   */
  const handleSave = useCallback(() => {
    if (isControlled) {
      onSave();
    } else {
      onSave(selected);
    }
  }, [isControlled, onSave, selected]);

  /**
   * Handle file select / parsing
   */
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileReader = new FileReader();
      const file = e.target.files[0];

      setSelectedFileName(file.name);

      fileReader.onload = async () => {
        try {
          let extractedContent;

          if (file.type === FILE_TYPES.pdf) {
            extractedContent = await extractPdfTextContent(fileReader.result);
          } else if (file.type === FILE_TYPES.rtf) {
            extractedContent = await convertRtfToPlainText(
              fileReader.result as ArrayBuffer
            );
          } else {
            extractedContent = fileReader.result;
          }

          setTextContent(null);
          setExtractedTextContent(
            typeof extractedContent === 'string' ? extractedContent : null
          );
        } catch (error: any) {
          toast({
            title: 'Error.',
            description: error?.message || 'Unexpected error occured',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      if (file.type === FILE_TYPES.txt) {
        fileReader.readAsText(file);
      } else if (file.type === FILE_TYPES.pdf || file.type === FILE_TYPES.rtf) {
        fileReader.readAsArrayBuffer(file);
      } else {
        toast({
          title: 'Not supported',
          description: 'This file format is not supported.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  /**
   * Handle upload click
   */
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current?.click();
    }
  };

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
              placeholder={
                selectedFileName ? `Using upload: ${selectedFileName}` : ''
              }
              value={textContent || ''}
              onChange={({ target }) => setTextContent(target.value)}
            />
            <FormHelperText fontSize="xs">
              You will get keyword suggestions based on your text. Please choose
              the most suitable ones. Keywords are used for job recommendations.
              You can also upload a text file or your CV (PDF).
            </FormHelperText>
          </FormControl>
          <Flex alignItems="center" mt={2} gap={4}>
            <Button
              size="sm"
              colorScheme="teal"
              disabled={!textContent?.length || recommendationsFetching}
              onClick={() => fetchRecommendations()}
            >
              Select keywords
            </Button>
            <Link
              color="blue.500"
              fontSize="sm"
              fontWeight="semibold"
              onClick={handleUploadClick}
            >
              Upload text file or CV
            </Link>
            <input
              hidden
              type="file"
              accept={Object.values(FILE_TYPES).join(', ')}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </Flex>
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
            {['both', 'occupations'].includes(type) && (
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
                            selected.findIndex(
                              s => s.uri === item.uri && !s.delete
                            ) > -1
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
            )}
            {['both', 'skills'].includes(type) && (
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
                            selected.findIndex(
                              s => s.uri === item.uri && !s.delete
                            ) > -1
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
            )}
            {type === 'occupations' && (
              <Stack>
                <Text fontWeight="semibold">
                  Did not find what you were looking for? Use free search.
                </Text>
                <MoreRecommendations
                  selected={selected}
                  onChange={selection => {
                    if (selection) {
                      handleSelect({
                        label: selection.label,
                        uri: selection.value,
                      });
                    }
                  }}
                />
              </Stack>
            )}
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
          onClick={handleSave}
        >
          Save selection
        </Button>
      </Stack>
    </React.Fragment>
  );
}
