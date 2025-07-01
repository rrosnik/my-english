# AI-Powered Data Extraction Guide

## 🚀 Overview

This enhanced system allows you to extract English vocabulary and learning content from multiple sources using AI:

- **📷 Images**: Extract text from photos, screenshots, book pages, etc.
- **📝 Text**: Analyze any English text for vocabulary learning
- **🌐 Websites**: Extract content from any webpage
- **📄 Documents**: Process various document types

## 🔧 Setup Instructions

### 1. Install Required Dependencies

```bash
# For basic OCR functionality (optional)
npm install tesseract.js

# For enhanced image processing (optional)
npm install sharp
```

### 2. Get API Keys

#### OpenAI API Key (Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-`)

#### Google Vision API Key (For OCR)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Vision API
4. Create credentials (API Key)
5. Copy the key (starts with `AIza`)

### 3. Environment Configuration

Create a `.env.local` file in your project root:

```env
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_GOOGLE_VISION_API_KEY=AIza-your-google-vision-key-here
```

## 📋 Features

### Core Capabilities

✅ **OCR (Optical Character Recognition)**

- Extract text from images using Google Vision API
- Fallback to Tesseract.js for offline processing
- Support for multiple image formats (JPG, PNG, GIF, etc.)

✅ **AI-Powered Text Analysis**

- Vocabulary extraction using OpenAI GPT-4
- Automatic difficulty assessment
- Part of speech identification
- Synonyms and antonyms detection

✅ **Multi-Source Extraction**

- Images (photos, screenshots, documents)
- Direct text input
- URLs and web pages
- Existing dictionary sites (enhanced)

✅ **Smart Content Processing**

- Context-aware vocabulary extraction
- Translation support (English ↔ Persian)
- Usage examples with context
- Etymology and word origins

### Advanced Features

🔄 **Fallback Systems**

- Rule-based extraction when AI is unavailable
- Multiple OCR providers
- Offline processing capabilities

🎯 **Learning-Focused**

- Difficulty level assessment
- Frequency analysis (common/uncommon/rare)
- Register detection (formal/informal/academic)
- Topic categorization

📊 **Quality Metrics**

- Confidence scores for extractions
- Source type tracking
- Error handling and retry logic

## 🎮 Usage Examples

### Basic Text Extraction

```typescript
import { useAIExtraction } from './hooks/useAIExtraction';

const MyComponent = () => {
  const { extractFromText, extractedData, isLoading } = useAIExtraction();

  const handleAnalyze = async () => {
    await extractFromText("The ephemeral beauty of cherry blossoms captivated tourists.");
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        Analyze Text
      </button>
      {extractedData && (
        <div>
          <h3>{extractedData.word}</h3>
          <p>{extractedData.definition}</p>
        </div>
      )}
    </div>
  );
};
```

### Image Processing

```typescript
const handleImageUpload = async (file: File) => {
  const options = {
    extractionType: 'image' as const,
    extractionMode: 'vocabulary' as const,
    includeTranslation: true,
  };
  
  await extractFromImage(file, options);
};
```

### URL Content Extraction

```typescript
const handleUrlAnalysis = async (url: string) => {
  const options = {
    extractionType: 'url' as const,
    extractionMode: 'academic' as const,
    targetLanguage: 'english' as const,
  };
  
  await extractFromUrl(url, options);
};
```

## 🔄 Integration with Existing System

The AI extraction seamlessly integrates with your current URL extraction system:

1. **Enhanced Dictionary Extraction**: Existing dictionary parsing + AI analysis
2. **Unified Data Format**: Same `ExtractedContent` interface
3. **Backward Compatibility**: All existing features continue to work
4. **Progressive Enhancement**: AI features activate when API keys are provided

## 🛠️ Customization

### Extraction Options

```typescript
interface AIExtractionOptions {
  extractionType: 'text' | 'image' | 'url' | 'document';
  targetLanguage?: 'english' | 'persian' | 'auto';
  extractionMode?: 'vocabulary' | 'general' | 'academic' | 'technical';
  includeTranslation?: boolean;
  includeContext?: boolean;
}
```

### Custom AI Prompts

You can customize the AI prompts for specific learning needs:

```typescript
// Academic vocabulary focus
const academicOptions = {
  extractionMode: 'academic',
  includeContext: true,
  targetLanguage: 'english',
};

// Technical terminology
const technicalOptions = {
  extractionMode: 'technical',
  includeTranslation: false,
};
```

## 🔐 Security & Privacy

- **API Keys**: Store securely in environment variables
- **Data Processing**: Text is processed via secure HTTPS
- **No Storage**: Images and text are not stored on external servers
- **Local Fallback**: Tesseract.js provides offline OCR capability

## 🎯 Best Practices

### For Images

- Use high-resolution images for better OCR accuracy
- Ensure good contrast between text and background
- Crop images to focus on text areas
- Support multiple languages if needed

### For Text Analysis

- Provide context for better vocabulary extraction
- Use complete sentences for accurate analysis
- Specify the target difficulty level
- Include domain-specific content when relevant

### For URLs

- Test with different website structures
- Handle rate limiting and CORS issues
- Cache results for frequently accessed pages
- Respect robots.txt and website policies

## 🔧 Troubleshooting

### Common Issues

**OCR Not Working**

- Check Google Vision API key validity
- Verify image format compatibility
- Ensure sufficient API quota
- Try Tesseract.js fallback

**AI Analysis Failing**

- Validate OpenAI API key
- Check API usage limits
- Verify text input format
- Use rule-based fallback

**URL Extraction Issues**

- Check CORS policies
- Try different proxy services
- Verify website accessibility
- Handle dynamic content loading

### Error Handling

The system includes comprehensive error handling:

```typescript
const { error, clearData } = useAIExtraction({
  onError: (error) => {
    console.error('Extraction failed:', error);
    // Handle error appropriately
  }
});
```

## 🚀 Future Enhancements

### Planned Features

- [ ] Azure Computer Vision integration
- [ ] AWS Textract support
- [ ] Batch processing capabilities
- [ ] Custom model training
- [ ] Real-time translation
- [ ] Audio content extraction
- [ ] Video subtitle processing

### Performance Optimizations

- [ ] Image compression before OCR
- [ ] Caching for repeated content
- [ ] Background processing
- [ ] Progressive loading
- [ ] WebWorker integration

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Vision API Guide](https://cloud.google.com/vision/docs)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [React Hook Patterns](https://react-hooks-cheatsheet.com/)

## 🤝 Contributing

To contribute to the AI extraction system:

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

Remember to test with various content types and languages!
