import { useState, useCallback } from 'react';
import { urlContentExtractor, ExtractionResult, ExtractedContent } from '../services/urlContentExtractor';
import { CardFormData, CardTypeEnum, LearningStatus, DifficultyLevel } from '../types';

export interface UseUrlExtractionOptions {
  onSuccess?: (extractedData: CardFormData) => void;
  onError?: (error: string) => void;
  autoDetectCardType?: boolean;
}

export interface UseUrlExtractionReturn {
  extractFromUrl: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  extractedData: ExtractedContent | null;
  lastResult: ExtractionResult | null;
  clearData: () => void;
}

export const useUrlExtraction = (options: UseUrlExtractionOptions = {}): UseUrlExtractionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedContent | null>(null);
  const [lastResult, setLastResult] = useState<ExtractionResult | null>(null);

  const convertToCardFormData = useCallback(
    (extracted: ExtractedContent): CardFormData => {
      const cardData: CardFormData = {
        english: extracted.word || '',
        englishCore: extracted.word || '',
        persian: '', // Would need translation service
        persianCore: '', // Would need translation service
        cardType: options.autoDetectCardType ? detectCardType(extracted) : CardTypeEnum.WORD,
        partOfSpeech: extracted.partOfSpeech,
        definition: extracted.definition || '',
        usageExamples: extracted.usageExamples || [],
        synonyms: extracted.synonyms || [],
        antonyms: extracted.antonyms || [],
        learningStatus: LearningStatus.NEW,
        reviewedNumber: 0,
        tags: {
          topics: extracted.topics || [],
          level: extracted.difficulty || DifficultyLevel.BEGINNER,
          frequency: extracted.frequency || 'common',
          register: extracted.register || 'neutral',
          origin: extracted.etymology,
        },
        notes: extracted.etymology ? `Etymology: ${extracted.etymology}` : '',
        mnemonics: '',
        imageUrl: '',
        audioData: extracted.audioUrl
          ? {
              audioUrl: extracted.audioUrl,
              phoneticTranscription: extracted.phoneticTranscription,
            }
          : undefined,
      };

      return cardData;
    },
    [options.autoDetectCardType],
  );

  const detectCardType = useCallback((extracted: ExtractedContent): CardTypeEnum => {
    const word = extracted.word?.toLowerCase() || '';

    // Simple heuristics to detect card type
    if (word.includes(' ')) {
      // Multi-word expressions
      if (word.split(' ').length > 4) {
        return CardTypeEnum.SENTENCE;
      }
      // Check for common idiom patterns
      if (isLikelyIdiom(word)) {
        return CardTypeEnum.IDIOM;
      }
      return CardTypeEnum.PHRASE;
    }

    // Single words
    return CardTypeEnum.WORD;
  }, []);

  const isLikelyIdiom = (text: string): boolean => {
    const idiomPatterns = [
      /break the/,
      /piece of cake/,
      /under the weather/,
      /spill the beans/,
      /hit the nail/,
      /cost an arm/,
      /at the drop of/,
      /beat around the bush/,
      /bite the bullet/,
      /call it a day/,
    ];

    return idiomPatterns.some((pattern) => pattern.test(text));
  };

  const extractFromUrl = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      setExtractedData(null);

      try {
        const result = await urlContentExtractor.extractFromURL(url);
        setLastResult(result);

        if (result.success && result.content) {
          setExtractedData(result.content);
          const cardData = convertToCardFormData(result.content);
          options.onSuccess?.(cardData);
        } else {
          const errorMessage = result.error || 'Failed to extract content from URL';
          setError(errorMessage);
          options.onError?.(errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [convertToCardFormData, options],
  );

  const clearData = useCallback(() => {
    setError(null);
    setExtractedData(null);
    setLastResult(null);
  }, []);

  return {
    extractFromUrl,
    isLoading,
    error,
    extractedData,
    lastResult,
    clearData,
  };
};

export default useUrlExtraction;
