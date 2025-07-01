import React, { useState } from 'react';
import { useAIExtraction } from '../../../hooks/useAIExtraction';
import { AIExtractionOptions } from '../../../services/aiDataExtractor';
import './AIExtractionDemo.scss';

export const AIExtractionDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [googleVisionKey, setGoogleVisionKey] = useState('');

  const { extractFromImage, extractFromText, extractFromUrl, isLoading, error, extractedData, confidence, clearData, setApiKeys } = useAIExtraction({
    onSuccess: (data, result) => {
      console.log('Extraction successful:', data, result);
    },
    onError: (error) => {
      console.error('Extraction failed:', error);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageExtraction = async () => {
    if (!selectedFile) return;

    const options: AIExtractionOptions = {
      extractionType: 'image',
      extractionMode: 'vocabulary',
      includeTranslation: true,
    };

    await extractFromImage(selectedFile, options);
  };

  const handleTextExtraction = async () => {
    if (!textInput.trim()) return;

    const options: AIExtractionOptions = {
      extractionType: 'text',
      extractionMode: 'vocabulary',
      includeTranslation: true,
    };

    await extractFromText(textInput, options);
  };

  const handleUrlExtraction = async () => {
    if (!urlInput.trim()) return;

    const options: AIExtractionOptions = {
      extractionType: 'url',
      extractionMode: 'vocabulary',
      includeTranslation: true,
    };

    await extractFromUrl(urlInput, options);
  };

  const handleSetApiKeys = () => {
    setApiKeys(openAIKey || undefined, googleVisionKey || undefined);
    alert('API keys updated!');
  };

  return (
    <div className="ai-extraction-demo">
      <h2>AI-Powered Data Extraction Demo</h2>

      {/* API Keys Configuration */}
      <section className="api-keys-section">
        <h3>🔑 API Keys Configuration</h3>
        <div className="api-keys-form">
          <div className="form-group">
            <label>OpenAI API Key:</label>
            <input type="password" value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} placeholder="sk-..." />
          </div>
          <div className="form-group">
            <label>Google Vision API Key:</label>
            <input type="password" value={googleVisionKey} onChange={(e) => setGoogleVisionKey(e.target.value)} placeholder="AIza..." />
          </div>
          <button onClick={handleSetApiKeys} className="btn-primary">
            Set API Keys
          </button>
        </div>
      </section>

      {/* Image Extraction */}
      <section className="extraction-section">
        <h3>📷 Extract from Image</h3>
        <div className="extraction-form">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile && (
            <div className="file-preview">
              <p>Selected: {selectedFile.name}</p>
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
          <button onClick={handleImageExtraction} disabled={!selectedFile || isLoading} className="btn-primary">
            {isLoading ? 'Processing...' : 'Extract from Image'}
          </button>
        </div>
      </section>

      {/* Text Extraction */}
      <section className="extraction-section">
        <h3>📝 Extract from Text</h3>
        <div className="extraction-form">
          <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Enter text to analyze for vocabulary..." rows={4} />
          <button onClick={handleTextExtraction} disabled={!textInput.trim() || isLoading} className="btn-primary">
            {isLoading ? 'Processing...' : 'Extract from Text'}
          </button>
        </div>
      </section>

      {/* URL Extraction */}
      <section className="extraction-section">
        <h3>🌐 Extract from URL</h3>
        <div className="extraction-form">
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/article" />
          <button onClick={handleUrlExtraction} disabled={!urlInput.trim() || isLoading} className="btn-primary">
            {isLoading ? 'Processing...' : 'Extract from URL'}
          </button>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Processing with AI...</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-display">
          <h4>❌ Error</h4>
          <p>{error}</p>
          <button onClick={clearData} className="btn-secondary">
            Clear Error
          </button>
        </div>
      )}

      {/* Results Display */}
      {extractedData && (
        <div className="results-display">
          <div className="results-header">
            <h4>✅ Extraction Results</h4>
            {confidence && <span className="confidence-badge">Confidence: {Math.round(confidence * 100)}%</span>}
            <button onClick={clearData} className="btn-secondary">
              Clear Results
            </button>
          </div>

          <div className="extraction-results">
            <div className="result-item">
              <strong>Word:</strong> {extractedData.word || 'N/A'}
            </div>

            <div className="result-item">
              <strong>Definition:</strong> {extractedData.definition || 'N/A'}
            </div>

            {extractedData.partOfSpeech && (
              <div className="result-item">
                <strong>Part of Speech:</strong> {extractedData.partOfSpeech}
              </div>
            )}

            {extractedData.pronunciation && (
              <div className="result-item">
                <strong>Pronunciation:</strong> {extractedData.pronunciation}
              </div>
            )}

            {extractedData.difficulty && (
              <div className="result-item">
                <strong>Difficulty:</strong> {extractedData.difficulty}
              </div>
            )}

            {extractedData.synonyms && extractedData.synonyms.length > 0 && (
              <div className="result-item">
                <strong>Synonyms:</strong> {extractedData.synonyms.join(', ')}
              </div>
            )}

            {extractedData.antonyms && extractedData.antonyms.length > 0 && (
              <div className="result-item">
                <strong>Antonyms:</strong> {extractedData.antonyms.join(', ')}
              </div>
            )}

            {extractedData.usageExamples && extractedData.usageExamples.length > 0 && (
              <div className="result-item">
                <strong>Usage Examples:</strong>
                <ul>
                  {extractedData.usageExamples.map((example, index) => (
                    <li key={index}>
                      &quot;{example.example}&quot;{example.translation && <span className="translation"> - {example.translation}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extractedData.topics && extractedData.topics.length > 0 && (
              <div className="result-item">
                <strong>Topics:</strong> {extractedData.topics.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <section className="instructions-section">
        <h3>📖 How to Use</h3>
        <div className="instructions">
          <h4>Setup:</h4>
          <ol>
            <li>
              Get an OpenAI API key from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                OpenAI
              </a>
            </li>
            <li>
              Get a Google Vision API key from{' '}
              <a href="https://cloud.google.com/vision/docs/setup" target="_blank" rel="noopener noreferrer">
                Google Cloud
              </a>
            </li>
            <li>Enter your API keys in the configuration section above</li>
          </ol>

          <h4>Extraction Types:</h4>
          <ul>
            <li>
              <strong>Image:</strong> Upload images with text (screenshots, photos of books, etc.)
            </li>
            <li>
              <strong>Text:</strong> Paste any English text for vocabulary analysis
            </li>
            <li>
              <strong>URL:</strong> Extract content from web pages
            </li>
          </ul>

          <h4>Features:</h4>
          <ul>
            <li>OCR (Optical Character Recognition) for images</li>
            <li>AI-powered vocabulary extraction</li>
            <li>Automatic difficulty assessment</li>
            <li>Synonyms and antonyms detection</li>
            <li>Usage examples with translations</li>
            <li>Part of speech identification</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AIExtractionDemo;
