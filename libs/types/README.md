# @my-english/types

Shared TypeScript types for the My English Dictionary application.

## Overview

This package contains all the shared types used across the My English Dictionary application, including both the web frontend and the server backend. The types are designed to work in both browser and Node.js environments.

## Installation

This package is meant to be used internally within the My English Dictionary monorepo.

```bash
# Build the types package
nx build types

# Run type checking
nx run types:type-check
```

## Features

- **ES Module Support**: Fully compatible with modern ES modules
- **TypeScript Definitions**: Complete type definitions for all exports
- **Cross-Platform**: Works in both browser and Node.js environments
- **Comprehensive Types**: Covers cards, learning data, AI extraction, and URL parsing

## Type Categories

### Card Types (`card.ts`)

- `EnglishCard` - Main card data structure
- `CardCollection` - Collection metadata
- `StudySession` - Learning session tracking
- `UserProgress` - User learning progress
- Various enums: `CardTypeEnum`, `LearningStatus`, `DifficultyLevel`, etc.

### Extraction Types (`extraction.ts`)

- `ExtractedContent` - Content extracted from dictionary URLs
- `ExtractionResult` - Result of URL extraction
- `SUPPORTED_SITES` - Supported dictionary websites

### AI Types (`ai.ts`)

- `AIExtractionPrompt` - AI content extraction inputs
- `AIExtractionResult` - AI extraction results
- `AIExtractionConfig` - AI configuration options

## Usage

```typescript
import { 
  EnglishCard, 
  CardTypeEnum, 
  ExtractedContent,
  AIExtractionResult 
} from '@my-english/types';

// Use the types in your application
const card: EnglishCard = {
  // ... card data
};
```

## Development

The types are organized in separate modules for better maintainability:

- `card.ts` - Core card and learning types
- `extraction.ts` - URL content extraction types  
- `ai.ts` - AI-related types
- `index.ts` - Main export file

## License

Private package for My English Dictionary project.
