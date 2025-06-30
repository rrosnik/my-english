import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, InputGroup, Modal } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useUrlExtraction } from '../../../hooks/useUrlExtraction';
import { CardFormData } from '../../../types';
import './index.scss';

interface UrlExtractorProps {
  onDataExtracted: (data: CardFormData) => void;
  onClose?: () => void;
  show?: boolean;
  autoDetectCardType?: boolean;
}

const UrlExtractor: React.FC<UrlExtractorProps> = ({ onDataExtracted, onClose, show = true, autoDetectCardType = true }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const { extractFromUrl, isLoading, error, extractedData, lastResult, clearData } = useUrlExtraction({
    onSuccess: (cardData) => {
      onDataExtracted(cardData);
      if (onClose) {
        onClose();
      }
    },
    onError: (errorMessage) => {
      console.error('URL Extraction Error:', errorMessage);
    },
    autoDetectCardType,
  });

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      setIsValidUrl(isValid);
      return isValid;
    } catch {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    validateUrl(inputUrl);
    if (error) {
      clearData();
    }
  };

  const handleExtract = async () => {
    if (!isValidUrl || !url.trim()) return;
    await extractFromUrl(url.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidUrl && !isLoading) {
      handleExtract();
    }
  };

  const getSupportedSites = () => [
    'Cambridge Dictionary',
    'Oxford Dictionary',
    'Merriam-Webster',
    'Collins Dictionary',
    'Longman Dictionary',
    'Vocabulary.com',
    'Dictionary.com',
    'Macmillan Dictionary',
  ];

  const renderContent = () => (
    <div className="url-extractor">
      <div className="mb-3">
        <Form.Label>
          <Icon icon="mdi:link" className="me-2" />
          Dictionary URL
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="url"
            placeholder="https://dictionary.cambridge.org/dictionary/english/example"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            isInvalid={url.length > 0 && !isValidUrl}
            disabled={isLoading}
          />
          <Button variant="primary" onClick={handleExtract} disabled={!isValidUrl || isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Extracting...
              </>
            ) : (
              <>
                <Icon icon="mdi:download" className="me-2" />
                Extract
              </>
            )}
          </Button>
        </InputGroup>
        <Form.Control.Feedback type="invalid">Please enter a valid URL starting with http:// or https://</Form.Control.Feedback>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          <Icon icon="mdi:alert-circle" className="me-2" />
          <strong>Extraction Failed:</strong> {error}
        </Alert>
      )}

      {lastResult && lastResult.success && extractedData && (
        <Alert variant="success" className="mb-3">
          <Icon icon="mdi:check-circle" className="me-2" />
          <strong>Success!</strong> Data extracted from {lastResult.sourceType} dictionary.
          {extractedData.word && (
            <div className="mt-2">
              <strong>Word:</strong> {extractedData.word}
              {extractedData.partOfSpeech && <span className="text-muted ms-2">({extractedData.partOfSpeech})</span>}
            </div>
          )}
          {extractedData.definition && (
            <div className="mt-1">
              <strong>Definition:</strong> {extractedData.definition.substring(0, 100)}
              {extractedData.definition.length > 100 && '...'}
            </div>
          )}
        </Alert>
      )}

      <div className="supported-sites">
        <h6>
          <Icon icon="mdi:information" className="me-2" />
          Supported Dictionary Sites
        </h6>
        <div className="row">
          {getSupportedSites().map((site) => (
            <div key={site} className="col-md-6 col-lg-4">
              <small className="text-muted">
                <Icon icon="mdi:check" className="me-1 text-success" />
                {site}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="extraction-tips mt-3">
        <h6>
          <Icon icon="mdi:lightbulb" className="me-2" />
          Tips for Best Results
        </h6>
        <ul className="small text-muted">
          <li>Use URLs from supported dictionary websites</li>
          <li>Make sure the URL points to a specific word definition page</li>
          <li>The extractor will automatically detect word type (word/phrase/idiom)</li>
          <li>You can edit the extracted data before saving</li>
          <li>Persian translations need to be added manually</li>
        </ul>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon icon="mdi:web" className="me-2" />
            Extract from Dictionary URL
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderContent()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return renderContent();
};

export default UrlExtractor;
