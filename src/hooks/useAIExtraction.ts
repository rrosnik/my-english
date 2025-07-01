import { useState, useCallback } from 'react';
import { aiDataExtractor, AIExtractionOptions, AIExtractionResult } from '../services/aiDataExtractor';
import { ExtractedContent } from '../services/urlContentExtractor';

export interface UseAIExtractionOptions {
  onSuccess?: (extractedData: ExtractedContent, result: AIExtractionResult) => void;
  onError?: (error: string) => void;
  autoConvertToCard?: boolean;
}

export interface UseAIExtractionReturn {
  extractFromImage: (imageFile: File | string, options?: AIExtractionOptions) => Promise<void>;
  extractFromText: (text: string, options?: AIExtractionOptions) => Promise<void>;
  extractFromUrl: (url: string, options?: AIExtractionOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  extractedData: ExtractedContent | null;
  lastResult: AIExtractionResult | null;
  confidence: number | null;
  clearData: () => void;
  setApiKeys: (openAIKey?: string, googleVisionKey?: string) => void;
}

export const useAIExtraction = (options: UseAIExtractionOptions = {}): UseAIExtractionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedContent | null>(null);
  const [lastResult, setLastResult] = useState<AIExtractionResult | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleExtractionResult = useCallback(
    (result: AIExtractionResult) => {
      setLastResult(result);

      if (result.success && result.content) {
        setExtractedData(result.content);
        setConfidence(result.confidence || null);
        options.onSuccess?.(result.content, result);
      } else {
        const errorMessage = result.error || 'Failed to extract content';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [options],
  );

  const extractFromImage = useCallback(
    async (imageFile: File | string, extractionOptions?: AIExtractionOptions) => {
      setIsLoading(true);
      setError(null);
      setExtractedData(null);
      setConfidence(null);

      try {
        const result = await aiDataExtractor.extractFromImage(imageFile, extractionOptions || { extractionType: 'image' });
        handleExtractionResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleExtractionResult, options],
  );

  const extractFromText = useCallback(
    async (text: string, extractionOptions?: AIExtractionOptions) => {
      setIsLoading(true);
      setError(null);
      setExtractedData(null);
      setConfidence(null);

      try {
        const result = await aiDataExtractor.extractFromText(text, extractionOptions || { extractionType: 'text' });
        handleExtractionResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleExtractionResult, options],
  );

  const extractFromUrl = useCallback(
    async (url: string, extractionOptions?: AIExtractionOptions) => {
      setIsLoading(true);
      setError(null);
      setExtractedData(null);
      setConfidence(null);

      try {
        const result = await aiDataExtractor.extractFromUrlWithAI(url, extractionOptions || { extractionType: 'url' });
        handleExtractionResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleExtractionResult, options],
  );

  const clearData = useCallback(() => {
    setError(null);
    setExtractedData(null);
    setLastResult(null);
    setConfidence(null);
  }, []);

  const setApiKeys = useCallback((openAIKey?: string, googleVisionKey?: string) => {
    if (openAIKey) {
      aiDataExtractor.setOpenAIKey(openAIKey);
    }
    if (googleVisionKey) {
      aiDataExtractor.setGoogleVisionKey(googleVisionKey);
    }
  }, []);

  return {
    extractFromImage,
    extractFromText,
    extractFromUrl,
    isLoading,
    error,
    extractedData,
    lastResult,
    confidence,
    clearData,
    setApiKeys,
  };
};

export default useAIExtraction;
