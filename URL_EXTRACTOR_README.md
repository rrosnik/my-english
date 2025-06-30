# URL Content Extractor Feature

This feature allows users to automatically extract English word definitions and related data from popular dictionary websites and import them directly into the English learning card form.

## 🌟 Features

### Automatic Data Extraction
- **Word/Phrase Recognition**: Automatically identifies the main word or phrase
- **Definitions**: Extracts comprehensive English definitions
- **Part of Speech**: Detects grammatical categories (noun, verb, adjective, etc.)
- **Usage Examples**: Captures real-world usage examples
- **Synonyms & Antonyms**: Collects related words when available
- **Pronunciation**: Extracts phonetic transcriptions and audio URLs
- **Difficulty Levels**: Attempts to determine learning difficulty

### Supported Dictionary Websites

| Website | Domain | Status |
|---------|--------|--------|
| Cambridge Dictionary | cambridge.org | ✅ Full Support |
| Oxford Dictionary | oxford.com | ✅ Full Support |
| Merriam-Webster | merriam-webster.com | ✅ Full Support |
| Collins Dictionary | collinsdictionary.com | ✅ Full Support |
| Longman Dictionary | ldoceonline.com | ✅ Full Support |
| Vocabulary.com | vocabulary.com | ✅ Full Support |
| Dictionary.com | dictionary.com | ✅ Full Support |
| Macmillan Dictionary | macmillandictionary.com | ✅ Partial Support |

## 🚀 How to Use

### In the Enhanced Form
1. Click the **"Import from URL"** button in the form header
2. Paste a dictionary URL in the input field
3. Click **"Extract"** to fetch and parse the content
4. Review the extracted data in the success alert
5. The form fields will be automatically populated
6. Add Persian translations manually
7. Save the card as usual

### Example URLs to Try
```
https://dictionary.cambridge.org/dictionary/english/serendipity
https://www.merriam-webster.com/dictionary/ubiquitous
https://www.vocabulary.com/dictionary/ephemeral
https://www.collinsdictionary.com/dictionary/english/perspicacious
```

## 🔧 Technical Implementation

### Architecture
```
URLContentExtractor Service
├── Site Detection Logic
├── CORS Proxy Handling
├── HTML Parsing Engine
└── Data Normalization

React Hook (useUrlExtraction)
├── State Management
├── Error Handling
├── Card Type Detection
└── Form Integration

UI Component (UrlExtractor)
├── URL Validation
├── Loading States
├── Error Display
└── Success Feedback
```

### Data Flow
1. **User Input**: URL entered in the extractor interface
2. **Validation**: URL format and supported site verification
3. **Fetching**: Content retrieved via direct fetch or CORS proxy
4. **Parsing**: HTML parsed using site-specific selectors
5. **Normalization**: Data mapped to EnglishCard structure
6. **Integration**: Form fields populated with extracted data

### Error Handling
- **CORS Issues**: Automatic fallback to proxy service
- **Unsupported Sites**: Clear error messages with site list
- **Network Failures**: Retry mechanisms and user feedback
- **Parsing Errors**: Graceful degradation with partial data

## 🎯 Smart Features

### Automatic Card Type Detection
The system intelligently determines the appropriate card type:
- **Word**: Single vocabulary items
- **Phrase**: Multi-word expressions
- **Idiom**: Common idiomatic expressions
- **Sentence**: Full sentence examples

### Content Enhancement
- **Definition Cleaning**: Removes markup and formatting artifacts
- **Example Filtering**: Selects the most relevant usage examples
- **Synonym Prioritization**: Orders synonyms by relevance
- **Difficulty Assessment**: Maps site indicators to app difficulty levels

## 🛠️ Configuration

### CORS Proxy Settings
The extractor uses `api.allorigins.win` as a fallback CORS proxy. This can be configured:

```typescript
private corsProxy = 'https://api.allorigins.win/raw?url=';
```

### Site-Specific Selectors
Each dictionary site has optimized CSS selectors:

```typescript
// Cambridge Dictionary selectors
const wordElement = doc.querySelector('.headword, .hw, h1');
const definitionElement = doc.querySelector('.def, .definition, .sense .def');
const posElement = doc.querySelector('.pos, .part-of-speech');
```

## 📊 Performance Considerations

### Optimization Strategies
- **Selective Parsing**: Only extracts necessary data
- **Efficient Selectors**: Uses optimized CSS selectors
- **Error Boundaries**: Prevents cascading failures
- **Memory Management**: Cleans up DOM objects

### Rate Limiting
- **User-Controlled**: Extraction triggered by explicit user action
- **Reasonable Delays**: No automatic batch processing
- **Respectful Access**: Follows robots.txt guidelines

## 🔮 Future Enhancements

### Planned Features
1. **Batch Import**: Process multiple URLs simultaneously
2. **Persian Translation**: Integrate translation services
3. **Audio Download**: Cache pronunciation audio locally
4. **Custom Sites**: Allow user-defined parsing rules
5. **History Tracking**: Remember previously extracted URLs

### Technical Improvements
1. **Server-Side Extraction**: Reduce CORS dependencies
2. **Machine Learning**: Improve parsing accuracy
3. **Real-Time Updates**: Live preview during extraction
4. **Offline Support**: Cache extraction rules for PWA

## 🧪 Testing

### Manual Testing
Use the Storybook stories to test different scenarios:
- **URL Extraction Demo**: Test the full integration
- **Validation Demo**: Test error handling
- **Standalone Extractor**: Test component isolation

### Test URLs by Site Type
- **Simple Words**: Basic vocabulary items
- **Complex Phrases**: Multi-word expressions
- **Technical Terms**: Specialized vocabulary
- **Idiomatic Expressions**: Common idioms

## 💡 Tips for Best Results

1. **Use Specific URLs**: Direct links to word definition pages work best
2. **Check Site Support**: Verify the dictionary is in the supported list
3. **Review Extracted Data**: Always verify before saving
4. **Add Persian Content**: Manually add translations and cultural context
5. **Customize as Needed**: Edit extracted content to fit your learning style

## 🤝 Contributing

To add support for a new dictionary site:

1. Add the domain to `SUPPORTED_SITES`
2. Create a parser method following the naming convention
3. Add site-specific CSS selectors
4. Test with multiple word types
5. Update documentation and examples

## 📝 License & Usage

This feature respects the terms of service of dictionary websites by:
- Only extracting publicly available content
- Not storing or redistributing copyrighted material
- Providing attribution to source websites
- Operating within fair use guidelines

The extracted content is used solely for personal learning purposes within the app.
