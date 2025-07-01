import type { DifficultyLevel, PartOfSpeech, UsageExample } from './card.js';

// Types for extracted content from URLs
export interface ExtractedContent {
  word?: string;
  definition?: string;
  partOfSpeech?: PartOfSpeech;
  pronunciation?: string;
  usageExamples?: UsageExample[];
  synonyms?: string[];
  antonyms?: string[];
  difficulty?: DifficultyLevel;
  etymology?: string;
  frequency?: 'common' | 'uncommon' | 'rare';
  register?: 'formal' | 'informal' | 'neutral' | 'academic' | 'colloquial';
  topics?: string[];
  phoneticTranscription?: string;
  audioUrl?: string;
}

export interface ExtractionResult {
  success: boolean;
  content?: ExtractedContent;
  error?: string;
  sourceUrl: string;
  sourceType: string;
}

// Supported dictionary and learning sites
export const SUPPORTED_SITES = {
  CAMBRIDGE: 'cambridge.org',
  OXFORD: 'oxford.com',
  MERRIAM_WEBSTER: 'merriam-webster.com',
  COLLINS: 'collinsdictionary.com',
  LONGMAN: 'ldoceonline.com',
  VOCABULARY_COM: 'vocabulary.com',
  WORDREFERENCE: 'wordreference.com',
  MACMILLAN: 'macmillandictionary.com',
  YOURDICTIONARY: 'yourdictionary.com',
  DICTIONARY_COM: 'dictionary.com',
} as const;

export type SupportedSiteKey = keyof typeof SUPPORTED_SITES;
export type SupportedSiteValue = (typeof SUPPORTED_SITES)[SupportedSiteKey];
