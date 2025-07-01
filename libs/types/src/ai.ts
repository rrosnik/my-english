import type { DifficultyLevel } from './card.js';
import type { ExtractionResult, ExtractedContent } from './extraction.js';

// AI extraction types
export interface AIExtractionPrompt {
  text: string;
  language?: 'english' | 'persian';
  targetDifficulty?: DifficultyLevel;
  includeExamples?: boolean;
  includeEtymology?: boolean;
  includeSynonyms?: boolean;
}

export interface AIExtractionResult extends ExtractionResult {
  confidence?: number;
  extractedText?: string;
  detectedLanguage?: string;
  translatedContent?: ExtractedContent;
  alternatives?: ExtractedContent[];
  data?: {
    words: string[];
    phrases: string[];
    idioms: string[];
    grammarPoints: string[];
    difficulty: DifficultyLevel;
    topics: string[];
  };
  processingTime?: number;
}

export interface AIExtractionConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  includeConfidence?: boolean;
}
