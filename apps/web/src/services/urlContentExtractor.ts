import { DifficultyLevel, PartOfSpeech, ExtractedContent, ExtractionResult, SUPPORTED_SITES } from '@my-english/types';

class URLContentExtractor {
  private corsProxy = 'https://api.allorigins.win/raw?url=';

  async extractFromURL(url: string): Promise<ExtractionResult> {
    try {
      const siteType = this.detectSiteType(url);

      if (!siteType) {
        return {
          success: false,
          error: 'Unsupported website. Please use a supported dictionary site.',
          sourceUrl: url,
          sourceType: 'unknown',
        };
      }

      const htmlContent = await this.fetchContent(url);
      const extractedContent = await this.parseContent(htmlContent, siteType);

      return {
        success: true,
        content: extractedContent,
        sourceUrl: url,
        sourceType: siteType,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract content',
        sourceUrl: url,
        sourceType: 'unknown',
      };
    }
  }

  private detectSiteType(url: string): string | null {
    const lowercaseUrl = url.toLowerCase();

    for (const [key, domain] of Object.entries(SUPPORTED_SITES)) {
      if (lowercaseUrl.includes(domain)) {
        return key;
      }
    }

    return null;
  }

  private async fetchContent(url: string): Promise<string> {
    try {
      // Try direct fetch first (will work if CORS is enabled)
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch {
      console.warn('Direct fetch failed, trying CORS proxy...');
    }

    // Fallback to CORS proxy
    try {
      const proxyUrl = this.corsProxy + encodeURIComponent(url);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch content from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async parseContent(html: string, siteType: string): Promise<ExtractedContent> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    switch (siteType) {
      case 'CAMBRIDGE':
        return this.parseCambridge(doc);
      case 'OXFORD':
        return this.parseOxford(doc);
      case 'MERRIAM_WEBSTER':
        return this.parseMerriamWebster(doc);
      case 'COLLINS':
        return this.parseCollins(doc);
      case 'LONGMAN':
        return this.parseLongman(doc);
      case 'VOCABULARY_COM':
        return this.parseVocabularyCom(doc);
      case 'DICTIONARY_COM':
        return this.parseDictionaryCom(doc);
      default:
        return this.parseGeneric(doc);
    }
  }

  private parseCambridge(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    // Extract word
    const wordElement = doc.querySelector('.headword, .hw, h1');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    // Extract definition
    const definitionElement = doc.querySelector('.def, .definition, .sense .def');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    // Extract part of speech
    const posElement = doc.querySelector('.pos, .part-of-speech');
    if (posElement) {
      result.partOfSpeech = this.mapPartOfSpeech(posElement.textContent?.trim() || '');
    }

    // Extract pronunciation
    const pronunciationElement = doc.querySelector('.pron, .pronunciation');
    if (pronunciationElement) {
      result.phoneticTranscription = pronunciationElement.textContent?.trim();
    }

    // Extract examples
    const exampleElements = doc.querySelectorAll('.example, .eg');
    if (exampleElements.length > 0) {
      result.usageExamples = Array.from(exampleElements)
        .map((el) => ({
          example: el.textContent?.trim() || '',
          translation: '', // Would need Persian translation service
        }))
        .filter((ex) => ex.example);
    }

    // Extract audio URL
    const audioElement = doc.querySelector('audio source, .sound');
    if (audioElement) {
      const audioSrc = audioElement.getAttribute('src');
      if (audioSrc) {
        result.audioUrl = audioSrc.startsWith('http') ? audioSrc : `https://dictionary.cambridge.org${audioSrc}`;
      }
    }

    // Extract difficulty/level indicators
    const levelElement = doc.querySelector('.level, .difficulty');
    if (levelElement) {
      result.difficulty = this.mapDifficultyLevel(levelElement.textContent?.trim() || '');
    }

    return result;
  }

  private parseOxford(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    // Oxford-specific selectors
    const wordElement = doc.querySelector('.headword, .h');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('.sense .definition, .def');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    const posElement = doc.querySelector('.part-of-speech, .pos');
    if (posElement) {
      result.partOfSpeech = this.mapPartOfSpeech(posElement.textContent?.trim() || '');
    }

    return result;
  }

  private parseMerriamWebster(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    // Merriam-Webster specific selectors
    const wordElement = doc.querySelector('.hword, .entry-word');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('.definition .dt, .dtText');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim().replace(/^:/, '').trim();
    }

    const posElement = doc.querySelector('.part-of-speech, .fl');
    if (posElement) {
      result.partOfSpeech = this.mapPartOfSpeech(posElement.textContent?.trim() || '');
    }

    // Etymology
    const etymologyElement = doc.querySelector('.etymology .et');
    if (etymologyElement) {
      result.etymology = etymologyElement.textContent?.trim();
    }

    return result;
  }

  private parseCollins(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    const wordElement = doc.querySelector('.headword, .orth');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('.definition, .def');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    return result;
  }

  private parseLongman(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    const wordElement = doc.querySelector('.headword, .Head');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('.Sense .DEF');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    return result;
  }

  private parseVocabularyCom(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    const wordElement = doc.querySelector('.word, h1');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('.definition, .short, .long');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    return result;
  }

  private parseDictionaryCom(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    const wordElement = doc.querySelector('[data-testid="headword"], .css-1urpfgu');
    if (wordElement) {
      result.word = wordElement.textContent?.trim();
    }

    const definitionElement = doc.querySelector('[data-testid="definition"], .css-1o58fj8');
    if (definitionElement) {
      result.definition = definitionElement.textContent?.trim();
    }

    return result;
  }

  private parseGeneric(doc: Document): ExtractedContent {
    const result: ExtractedContent = {};

    // Generic fallback parsing
    const possibleWords = doc.querySelectorAll('h1, h2, .word, .headword, .entry-word');
    if (possibleWords.length > 0) {
      result.word = possibleWords[0].textContent?.trim();
    }

    const possibleDefinitions = doc.querySelectorAll('.definition, .meaning, .def, p');
    if (possibleDefinitions.length > 0) {
      result.definition = possibleDefinitions[0].textContent?.trim();
    }

    return result;
  }

  private mapPartOfSpeech(pos: string): PartOfSpeech | undefined {
    const normalized = pos.toLowerCase().trim();

    const mapping: Record<string, PartOfSpeech> = {
      noun: PartOfSpeech.NOUN,
      verb: PartOfSpeech.VERB,
      adjective: PartOfSpeech.ADJECTIVE,
      adverb: PartOfSpeech.ADVERB,
      preposition: PartOfSpeech.PREPOSITION,
      conjunction: PartOfSpeech.CONJUNCTION,
      interjection: PartOfSpeech.INTERJECTION,
      pronoun: PartOfSpeech.PRONOUN,
      determiner: PartOfSpeech.DETERMINER,
      n: PartOfSpeech.NOUN,
      v: PartOfSpeech.VERB,
      adj: PartOfSpeech.ADJECTIVE,
      adv: PartOfSpeech.ADVERB,
      prep: PartOfSpeech.PREPOSITION,
      conj: PartOfSpeech.CONJUNCTION,
      interj: PartOfSpeech.INTERJECTION,
      pron: PartOfSpeech.PRONOUN,
      det: PartOfSpeech.DETERMINER,
    };

    return mapping[normalized];
  }

  private mapDifficultyLevel(level: string): DifficultyLevel | undefined {
    const normalized = level.toLowerCase().trim();

    const mapping: Record<string, DifficultyLevel> = {
      beginner: DifficultyLevel.BEGINNER,
      elementary: DifficultyLevel.ELEMENTARY,
      intermediate: DifficultyLevel.INTERMEDIATE,
      'upper intermediate': DifficultyLevel.UPPER_INTERMEDIATE,
      'upper-intermediate': DifficultyLevel.UPPER_INTERMEDIATE,
      advanced: DifficultyLevel.ADVANCED,
      proficient: DifficultyLevel.PROFICIENT,
      a1: DifficultyLevel.BEGINNER,
      a2: DifficultyLevel.ELEMENTARY,
      b1: DifficultyLevel.INTERMEDIATE,
      b2: DifficultyLevel.UPPER_INTERMEDIATE,
      c1: DifficultyLevel.ADVANCED,
      c2: DifficultyLevel.PROFICIENT,
    };

    return mapping[normalized];
  }

  // Helper method to clean extracted text
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/^\W+|\W+$/g, '')
      .trim();
  }
}

export const urlContentExtractor = new URLContentExtractor();
export default urlContentExtractor;
