import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EnhancedAddEnglishCardForm from './index';
import { EnglishCard, CardTypeEnum, DifficultyLevel, PartOfSpeech, LearningStatus } from '@my-english/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

// Mock callback functions for Storybook
const mockOnUpdate = () => console.log('Card updated successfully');
const mockOnClose = () => console.log('Form closed');

const meta: Meta<typeof EnhancedAddEnglishCardForm> = {
  title: 'Organisms/Forms/EnhancedAddEnglishCardForm',
  component: EnhancedAddEnglishCardForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# EnhancedAddEnglishCardForm

A comprehensive form component for adding and editing English learning cards with advanced features including:

- **Multi-tab interface**: Basic info, additional details, usage examples, and synonyms/antonyms
- **Card type selection**: Support for words, idioms, phrases, sentences, and more
- **Rich metadata**: Part of speech, difficulty levels, topics, and pronunciation features
- **Dynamic arrays**: Add/remove usage examples, synonyms, and antonyms
- **Audio integration**: Text-to-speech functionality for pronunciation
- **Validation**: Form validation using Yup schema
- **Responsive design**: Bootstrap-based responsive layout

## Features

### Basic Info Tab
- Card type selection (word, idiom, phrase, etc.)
- English and Persian core words/phrases
- Full sentence context in both languages
- Part of speech and difficulty level selection

### Additional Info Tab
- Definition field for English explanations
- Image URL for visual learning aids
- Topics categorization
- Personal notes and mnemonics

### Examples Tab
- Dynamic usage examples with translations
- Add/remove functionality
- Bilingual input support

### Synonyms & Antonyms Tab
- Dynamic synonym and antonym lists
- Individual word management
- Easy add/remove interface

## Props

- \`setName\`: Collection name for Firebase storage
- \`updatingItem\`: Optional existing card for edit mode
- \`onUpdate\`: Callback function after successful save/update
- \`onClose\`: Optional callback for modal/dialog close functionality
        `,
      },
    },
  },
  argTypes: {
    setName: {
      description: 'Collection name for Firebase storage',
      control: 'text',
    },
    updatingItem: {
      description: 'Existing card data for edit mode',
      control: 'object',
    },
    onUpdate: {
      description: 'Callback function triggered after successful save/update',
    },
    onClose: {
      description: 'Callback function for closing the form',
    },
  },
  decorators: [
    (Story) => (
      <div className="storybook-decorator">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample card data for stories
const sampleCard: EnglishCard = {
  id: '1',
  english: 'I need to break the ice with my new colleagues during the meeting.',
  englishCore: 'break the ice',
  persian: 'باید با همکاران جدیدم در جلسه آشنا شوم و فضا را گرم کنم.',
  persianCore: 'آشنایی اولیه',
  cardType: CardTypeEnum.IDIOM,
  partOfSpeech: PartOfSpeech.VERB,
  definition: 'To initiate conversation or social interaction in a way that relaxes tension or formality',
  imageUrl: 'https://example.com/ice-breaking.jpg',
  notes: 'Common in business and social contexts',
  mnemonics: 'Think of literally breaking ice to create an opening',
  created_at: Date.now() - 86400000,
  updated_at: Date.now(),
  reviewedNumber: 3,
  learningStatus: LearningStatus.LEARNING,
  usageExamples: [
    {
      example: 'The host told a funny story to break the ice.',
      translation: 'میزبان داستان خنده‌داری گفت تا فضا را گرم کند.',
    },
    {
      example: 'Small talk helps break the ice at networking events.',
      translation: 'صحبت‌های کوتاه در رویدادهای شبکه‌سازی کمک می‌کند فضا گرم شود.',
    },
  ],
  synonyms: ['start conversation', 'initiate contact', 'ease tension'],
  antonyms: ['create tension', 'remain formal', 'stay distant'],
  reviewStats: {
    totalReviews: 5,
    correctAnswers: 3,
    incorrectAnswers: 2,
    averageResponseTime: 4500,
    streakCount: 2,
    lapses: 1,
  },
  spacedRepetition: {
    interval: 3,
    easeFactor: 2.3,
    nextReviewDate: Date.now() + 259200000,
    repetitions: 2,
  },
  tags: {
    topics: ['business', 'social', 'communication'],
    level: DifficultyLevel.INTERMEDIATE,
    frequency: 'common',
    register: 'informal',
  },
};

// Default story for adding a new card
export const AddNewCard: Story = {
  args: {
    setName: 'vocabulary-cards',
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Add New Card Mode**

This is the default state for adding a new English learning card. The form starts empty with all tabs available for input. Users can:

- Select card type (word, idiom, phrase, etc.)
- Fill in basic English and Persian content
- Add additional metadata and learning aids
- Include usage examples with translations
- Specify synonyms and antonyms

The form validates required fields and provides feedback for proper completion.
        `,
      },
    },
  },
};

// Story for editing an existing card
export const EditExistingCard: Story = {
  args: {
    setName: 'vocabulary-cards',
    updatingItem: sampleCard,
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Edit Existing Card Mode**

This story demonstrates the form in edit mode with pre-populated data from an existing card. The form shows:

- Pre-filled basic information (English/Persian content)
- Existing card type and metadata
- Current usage examples with add/remove functionality
- Existing synonyms and antonyms lists
- All previously saved additional information

The submit button changes to "Update" and the form title reflects the edit mode.
        `,
      },
    },
  },
};

// Story showing the form without a close button (embedded mode)
export const EmbeddedMode: Story = {
  args: {
    setName: 'vocabulary-cards',
    onUpdate: mockOnUpdate,
    // No onClose prop - hides the close button
  },
  parameters: {
    docs: {
      description: {
        story: `
**Embedded Mode**

This version shows the form without a close button, suitable for embedding in pages where the form is the main content rather than a modal or overlay.
        `,
      },
    },
  },
};

// Story focusing on different card types
export const WordCard: Story = {
  args: {
    setName: 'vocabulary-cards',
    updatingItem: {
      ...sampleCard,
      id: '2',
      english: 'The ambitious entrepreneur launched three startups simultaneously.',
      englishCore: 'ambitious',
      persian: 'کارآفرین جاه‌طلب سه شرکت نوپا را همزمان راه‌اندازی کرد.',
      persianCore: 'جاه‌طلب',
      cardType: CardTypeEnum.WORD,
      partOfSpeech: PartOfSpeech.ADJECTIVE,
      definition: 'Having or showing a strong desire and determination to succeed',
      usageExamples: [
        {
          example: 'She is ambitious about her career goals.',
          translation: 'او نسبت به اهداف شغلی‌اش جاه‌طلب است.',
        },
      ],
      synonyms: ['driven', 'determined', 'aspiring'],
      antonyms: ['unmotivated', 'complacent', 'lazy'],
      tags: {
        topics: ['personality', 'business', 'success'],
        level: DifficultyLevel.INTERMEDIATE,
        frequency: 'common',
        register: 'neutral',
      },
    },
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Word Card Example**

This story demonstrates a typical word card with:
- Single word focus ("ambitious")
- Clear part of speech (adjective)
- Comprehensive definition
- Relevant usage examples
- Appropriate synonyms and antonyms
- Topic categorization for business/personality contexts
        `,
      },
    },
  },
};

// Story showing a phrase card
export const PhraseCard: Story = {
  args: {
    setName: 'vocabulary-cards',
    updatingItem: {
      ...sampleCard,
      id: '3',
      english: 'Could you give me a hand with moving this furniture?',
      englishCore: 'give me a hand',
      persian: 'می‌تونی کمکم کنی این مبل‌ها رو جابه‌جا کنم؟',
      persianCore: 'کمک کردن',
      cardType: CardTypeEnum.PHRASE,
      partOfSpeech: PartOfSpeech.VERB,
      definition: 'To help someone with a task or activity',
      usageExamples: [
        {
          example: 'Can you give me a hand with these boxes?',
          translation: 'می‌تونی با این جعبه‌ها کمکم کنی؟',
        },
      ],
      synonyms: ['help out', 'assist', 'lend a hand'],
      antonyms: ['refuse help', 'ignore', 'abandon'],
      tags: {
        topics: ['daily life', 'requests', 'help'],
        level: DifficultyLevel.ELEMENTARY,
        frequency: 'common',
        register: 'informal',
      },
    },
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Phrase Card Example**

This story shows a common English phrase card featuring:
- Everyday conversational phrase
- Informal register marking
- Practical usage context
- Elementary difficulty level
- Common frequency indicator
        `,
      },
    },
  },
};

// Story with complex form validation demonstration
export const ValidationDemo: Story = {
  args: {
    setName: '', // Empty to trigger validation
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Form Validation Demo**

This story demonstrates the form's validation behavior:
- Required field validation (English core, Persian core, etc.)
- URL validation for image fields
- Card type selection requirement
- Real-time validation feedback

Try submitting the form without filling required fields to see validation messages.
        `,
      },
    },
  },
};

// Story showing all tabs and features
export const FullFeaturesDemo: Story = {
  args: {
    setName: 'vocabulary-cards',
    updatingItem: {
      ...sampleCard,
      id: '4',
      english: 'The cutting-edge technology revolutionized the entire industry overnight.',
      englishCore: 'cutting-edge',
      persian: 'فناوری پیشرفته کل صنعت را یک‌شبه متحول کرد.',
      persianCore: 'پیشرفته',
      cardType: CardTypeEnum.WORD,
      partOfSpeech: PartOfSpeech.ADJECTIVE,
      definition: 'Very advanced; at the forefront of technological or other developments',
      imageUrl: 'https://example.com/technology.jpg',
      notes: 'Often used in technology and innovation contexts. Can be hyphenated as adjective.',
      mnemonics: 'Think of a knife cutting through the edge of innovation',
      usageExamples: [
        {
          example: 'The company uses cutting-edge AI technology.',
          translation: 'شرکت از فناوری هوش مصنوعی پیشرفته استفاده می‌کند.',
        },
        {
          example: 'Their research is at the cutting edge of science.',
          translation: 'تحقیقات آن‌ها در خط مقدم علم قرار دارد.',
        },
        {
          example: 'We need cutting-edge solutions for modern problems.',
          translation: 'ما به راه‌حل‌های پیشرفته برای مشکلات مدرن نیاز داریم.',
        },
      ],
      synonyms: ['state-of-the-art', 'advanced', 'innovative', 'modern', 'latest'],
      antonyms: ['outdated', 'obsolete', 'old-fashioned', 'traditional', 'primitive'],
      tags: {
        topics: ['technology', 'innovation', 'business', 'science'],
        level: DifficultyLevel.UPPER_INTERMEDIATE,
        frequency: 'common',
        register: 'neutral',
        origin: 'modern English, technology context',
      },
    },
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Complete Features Demonstration**

This story showcases all available features of the EnhancedAddEnglishCardForm:

**Basic Info Tab:**
- Card type selection (word)
- English and Persian content
- Part of speech and difficulty level

**Additional Info Tab:**
- Comprehensive definition
- Image URL for visual aid
- Multiple topic tags
- Personal notes and mnemonics

**Examples Tab:**
- Multiple usage examples
- Bilingual translations
- Context-specific sentences

**Synonyms & Antonyms Tab:**
- Extensive synonym list
- Comprehensive antonym collection
- Easy management interface

This represents a fully populated card with all metadata for optimal learning experience.
        `,
      },
    },
  },
};

// New story demonstrating URL extraction feature
export const UrlExtractionDemo: Story = {
  args: {
    setName: 'vocabulary-cards',
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  },
  parameters: {
    docs: {
      description: {
        story: `
**URL Extraction Feature Demo**

This story demonstrates the new URL extraction feature that allows users to automatically populate card data from dictionary websites:

**How to Use:**
1. Click the "Import from URL" button in the form header
2. Paste a URL from a supported dictionary website
3. Click "Extract" to automatically fill the form fields

**Supported Dictionary Sites:**
- Cambridge Dictionary (dictionary.cambridge.org)
- Oxford Dictionary (oxford.com)
- Merriam-Webster (merriam-webster.com)
- Collins Dictionary (collinsdictionary.com)
- Longman Dictionary (ldoceonline.com)
- Vocabulary.com
- Dictionary.com
- Macmillan Dictionary

**Example URLs to try:**
- https://dictionary.cambridge.org/dictionary/english/serendipity
- https://www.merriam-webster.com/dictionary/ubiquitous
- https://www.vocabulary.com/dictionary/ephemeral

**Extracted Data Includes:**
- Word/phrase and definition
- Part of speech
- Usage examples
- Synonyms and antonyms (when available)
- Pronunciation information
- Difficulty level indicators

**Note:** Persian translations need to be added manually after extraction.
        `,
      },
    },
  },
};

// Story showing the standalone URL extractor component
export const StandaloneUrlExtractor: Story = {
  render: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [extractedData] = React.useState<any>(null);

    return (
      <div>
        <h5>Standalone URL Extractor</h5>
        <p>This shows the URL extractor component in standalone mode:</p>

        {/* Import the UrlExtractor component here when using */}
        <div className="border rounded p-3">
          <p className="text-muted">The UrlExtractor component would be rendered here in a real implementation. It provides a clean interface for extracting dictionary data from URLs.</p>
          {extractedData && (
            <div className="mt-3">
              <h6>Extracted Data:</h6>
              <pre>{JSON.stringify(extractedData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
**Standalone URL Extractor Component**

The URL extractor can also be used as a standalone component outside of the form context. This is useful for:

- Batch importing multiple words
- Testing URL extraction
- Integration with other forms or workflows
- Preview functionality

The component provides a clean, modal-based interface with:
- URL validation
- Real-time extraction feedback
- Support site information
- Usage tips and guidelines
        `,
      },
    },
  },
};
