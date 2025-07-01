import { ExtractedContent, ExtractionResult } from './urlContentExtractor';
import { DifficultyLevel } from '../types';

// Enhanced extraction types for AI-powered extraction
export interface AIExtractionOptions {
  extractionType: 'text' | 'image' | 'url' | 'document';
  targetLanguage?: 'english' | 'persian' | 'auto';
  extractionMode?: 'vocabulary' | 'general' | 'academic' | 'technical';
  includeTranslation?: boolean;
  includeContext?: boolean;
}

export interface AIExtractionResult extends ExtractionResult {
  confidence?: number;
  extractedText?: string;
  detectedLanguage?: string;
  translatedContent?: ExtractedContent;
  alternatives?: ExtractedContent[];
}

export class AIDataExtractor {
  private openAIApiKey: string | null = null;
  private googleVisionApiKey: string | null = null;

  constructor() {
    this.openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    this.googleVisionApiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY || null;
  }

  // Extract text and vocabulary from images using OCR + AI
  async extractFromImage(imageFile: File | string, options: AIExtractionOptions = { extractionType: 'image' }): Promise<AIExtractionResult> {
    try {
      const extractedText = await this.performOCR(imageFile);

      if (!extractedText) {
        return {
          success: false,
          error: 'No text found in image',
          sourceUrl: typeof imageFile === 'string' ? imageFile : 'uploaded_image',
          sourceType: 'image',
        };
      }

      const vocabularyData = await this.processTextWithAI(extractedText, options);

      return {
        success: true,
        content: vocabularyData,
        extractedText,
        confidence: 0.85,
        sourceUrl: typeof imageFile === 'string' ? imageFile : 'uploaded_image',
        sourceType: 'image',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract from image',
        sourceUrl: typeof imageFile === 'string' ? imageFile : 'uploaded_image',
        sourceType: 'image',
      };
    }
  }

  // Extract and analyze text content using AI
  async extractFromText(text: string, options: AIExtractionOptions = { extractionType: 'text' }): Promise<AIExtractionResult> {
    try {
      const vocabularyData = await this.processTextWithAI(text, options);

      return {
        success: true,
        content: vocabularyData,
        extractedText: text,
        confidence: 0.9,
        sourceUrl: 'direct_text',
        sourceType: 'text',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process text',
        sourceUrl: 'direct_text',
        sourceType: 'text',
      };
    }
  }

  // Enhanced URL extraction with AI processing
  async extractFromUrlWithAI(url: string, options: AIExtractionOptions = { extractionType: 'url' }): Promise<AIExtractionResult> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const cleanText = this.extractTextFromHTML(html);
      const vocabularyData = await this.processTextWithAI(cleanText, options);

      return {
        success: true,
        content: vocabularyData,
        extractedText: cleanText,
        confidence: 0.8,
        sourceUrl: url,
        sourceType: 'url',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract from URL',
        sourceUrl: url,
        sourceType: 'url',
      };
    }
  }

  // OCR functionality - simplified version
  private async performOCR(imageFile: File | string): Promise<string | null> {
    if (this.googleVisionApiKey) {
      return await this.googleVisionOCR(imageFile);
    }

    // Fallback: return null to indicate OCR not available
    console.warn('No OCR service configured. Set VITE_GOOGLE_VISION_API_KEY or install tesseract.js');
    return null;
  }

  private async googleVisionOCR(imageFile: File | string): Promise<string | null> {
    try {
      let base64Image: string;

      if (typeof imageFile === 'string') {
        const response = await fetch(imageFile);
        const blob = await response.blob();
        base64Image = await this.blobToBase64(blob);
      } else {
        base64Image = await this.fileToBase64(imageFile);
      }

      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.googleVisionApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(',')[1],
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      });

      const result = await response.json();
      return result.responses[0]?.textAnnotations[0]?.description || null;
    } catch (error) {
      console.error('Google Vision OCR failed:', error);
      return null;
    }
  }

  // AI text processing using OpenAI
  private async processTextWithAI(text: string, options: AIExtractionOptions): Promise<ExtractedContent> {
    if (this.openAIApiKey) {
      return await this.openAITextProcessing(text, options);
    }

    return await this.ruleBasedExtraction(text);
  }

  private async openAITextProcessing(text: string, options: AIExtractionOptions): Promise<ExtractedContent> {
    try {
      const prompt = this.buildAIPrompt(text, options);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert English language tutor that extracts vocabulary and learning content from text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      });

      const result = await response.json();
      const extractedData = JSON.parse(result.choices[0].message.content);

      return extractedData;
    } catch (error) {
      console.error('OpenAI processing failed:', error);
      return await this.ruleBasedExtraction(text);
    }
  }

  private buildAIPrompt(text: string, options: AIExtractionOptions): string {
    return `Extract English vocabulary learning data from the following text. 
Return a JSON object with this structure:

{
  "word": "main word or phrase",
  "definition": "clear English definition",
  "partOfSpeech": "noun|verb|adjective|adverb|preposition|conjunction|interjection|phrase|idiom",
  "pronunciation": "phonetic transcription if available",
  "usageExamples": [{"example": "sentence", "translation": "persian if requested"}],
  "synonyms": ["list", "of", "synonyms"],
  "antonyms": ["list", "of", "antonyms"],
  "difficulty": "beginner|intermediate|advanced",
  "etymology": "origin information if available",
  "frequency": "common|uncommon|rare",
  "register": "formal|informal|neutral|academic|colloquial",
  "topics": ["relevant", "topic", "tags"]
}

Extraction mode: ${options.extractionMode || 'vocabulary'}
Include translation: ${options.includeTranslation || false}
Target language: ${options.targetLanguage || 'english'}

Text: "${text}"

Focus on the most useful vocabulary for English learners.`;
  }

  // Fallback rule-based extraction
  private async ruleBasedExtraction(text: string): Promise<ExtractedContent> {
    const words = text.split(/\s+/).filter((word) => word.length > 3);
    const mainWord = words[0]?.toLowerCase().replace(/[^\w]/g, '') || '';

    return {
      word: mainWord,
      definition: `Definition extracted from: ${text.substring(0, 100)}...`,
      partOfSpeech: undefined,
      difficulty: DifficultyLevel.INTERMEDIATE,
      usageExamples: [{ example: text.substring(0, 150) + '...', translation: '' }],
      frequency: 'common',
      register: 'neutral',
      topics: ['general'],
    };
  }

  // Utility methods
  private extractTextFromHTML(html: string): string {
    let cleanHtml = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
    cleanHtml = cleanHtml.replace(/<style[^>]*>.*?<\/style>/gis, '');
    cleanHtml = cleanHtml.replace(/<[^>]*>/g, ' ');
    cleanHtml = cleanHtml.replace(/\s+/g, ' ').trim();

    return cleanHtml;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Configuration methods
  setOpenAIKey(apiKey: string) {
    this.openAIApiKey = apiKey;
  }

  setGoogleVisionKey(apiKey: string) {
    this.googleVisionApiKey = apiKey;
  }
}

export const aiDataExtractor = new AIDataExtractor();
