import React, { useState } from 'react';
import { Formik } from 'formik';
import { InputGroup, Form, Button, Card, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import * as yup from 'yup';
import firebase from '../../../../firebase';
import { EnglishCard, CardFormData, CardTypeEnum, DifficultyLevel, PartOfSpeech, LearningStatus, UsageExample } from '../../../../types';
import Speaker from '../../../molecules/Speaker';
import UrlExtractor from '../../UrlExtractor';
import './index.scss';

interface EnhancedCardFormProps {
  setName: string;
  updatingItem?: EnglishCard;
  onUpdate?: () => void;
  onClose?: () => void;
}

const AddCardValidationSchema = yup.object({
  english: yup.string().required('The English field is required'),
  englishCore: yup.string().required('The English core is required'),
  persian: yup.string().required('The Persian field is required'),
  persianCore: yup.string().required('The Persian core is required'),
  cardType: yup.mixed().oneOf(Object.values(CardTypeEnum), 'The type is incorrect').required('The type of card should be selected'),
  imageUrl: yup.string().url('This field should be a valid URL').optional(),
  definition: yup.string().optional(),
  notes: yup.string().optional(),
  mnemonics: yup.string().optional(),
});

const EnhancedAddEnglishCardForm: React.FC<EnhancedCardFormProps> = ({ setName, updatingItem, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [usageExamples, setUsageExamples] = useState<UsageExample[]>(updatingItem?.usageExamples || [{ example: '', translation: '' }]);
  const [synonyms, setSynonyms] = useState<string[]>(updatingItem?.synonyms || ['']);
  const [antonyms, setAntonyms] = useState<string[]>(updatingItem?.antonyms || ['']);
  const [showUrlExtractor, setShowUrlExtractor] = useState(false);
  const [extractedData, setExtractedData] = useState<CardFormData | null>(null);

  const addToExpressions = (data: CardFormData) => {
    const now = Date.now();

    const input: EnglishCard = {
      ...data,
      created_at: now,
      updated_at: now,
      reviewedNumber: data.reviewedNumber || 0,
      learningStatus: data.learningStatus || LearningStatus.NEW,
      usageExamples: usageExamples.filter((ex) => ex.example.trim() && ex.translation.trim()),
      synonyms: synonyms.filter((s) => s.trim()),
      antonyms: antonyms.filter((a) => a.trim()),
      reviewStats: {
        totalReviews: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        averageResponseTime: 0,
        streakCount: 0,
        lapses: 0,
      },
      spacedRepetition: {
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: now + 24 * 60 * 60 * 1000, // 1 day from now
        repetitions: 0,
      },
      tags: data.tags || {
        topics: [],
        level: DifficultyLevel.BEGINNER,
      },
    };

    delete input.id;

    if (!updatingItem?.id) {
      return firebase.utils.fsDatabase.addItem(setName, input);
    } else {
      return firebase.utils.fsDatabase.updateItem(setName, updatingItem.id, input);
    }
  };

  const addUsageExample = () => {
    setUsageExamples([...usageExamples, { example: '', translation: '' }]);
  };

  const removeUsageExample = (index: number) => {
    setUsageExamples(usageExamples.filter((_, i) => i !== index));
  };

  const updateUsageExample = (index: number, field: 'example' | 'translation', value: string) => {
    const updated = usageExamples.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    setUsageExamples(updated);
  };

  const addSynonym = () => {
    setSynonyms([...synonyms, '']);
  };

  const removeSynonym = (index: number) => {
    setSynonyms(synonyms.filter((_, i) => i !== index));
  };

  const updateSynonym = (index: number, value: string) => {
    const updated = synonyms.map((s, i) => (i === index ? value : s));
    setSynonyms(updated);
  };

  const addAntonym = () => {
    setAntonyms([...antonyms, '']);
  };

  const removeAntonym = (index: number) => {
    setAntonyms(antonyms.filter((_, i) => i !== index));
  };

  const updateAntonym = (index: number, value: string) => {
    const updated = antonyms.map((a, i) => (i === index ? value : a));
    setAntonyms(updated);
  };

  return (
    <Card className="enhanced-add-card-form">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{updatingItem?.id ? 'Update Card' : 'Add New Card'}</h5>
          <div className="d-flex gap-2">
            {!updatingItem?.id && (
              <Button variant="outline-primary" size="sm" onClick={() => setShowUrlExtractor(true)} title="Extract from Dictionary URL">
                <Icon icon="mdi:web" className="me-1" />
                Import from URL
              </Button>
            )}
            {onClose && (
              <Button variant="outline-secondary" size="sm" onClick={onClose}>
                <Icon icon="mdi:close" />
              </Button>
            )}
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <Formik
          initialValues={{
            english: extractedData?.english || updatingItem?.english || '',
            englishCore: extractedData?.englishCore || updatingItem?.englishCore || '',
            persian: extractedData?.persian || updatingItem?.persian || '',
            persianCore: extractedData?.persianCore || updatingItem?.persianCore || '',
            cardType: extractedData?.cardType || updatingItem?.cardType || CardTypeEnum.WORD,
            partOfSpeech: extractedData?.partOfSpeech || updatingItem?.partOfSpeech || PartOfSpeech.NOUN,
            imageUrl: extractedData?.imageUrl || updatingItem?.imageUrl || '',
            definition: extractedData?.definition || updatingItem?.definition || '',
            notes: extractedData?.notes || updatingItem?.notes || '',
            mnemonics: extractedData?.mnemonics || updatingItem?.mnemonics || '',
            level: extractedData?.tags?.level || updatingItem?.tags?.level || DifficultyLevel.BEGINNER,
            topics: extractedData?.tags?.topics?.join(', ') || updatingItem?.tags?.topics?.join(', ') || '',
          }}
          enableReinitialize={true}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            const cardData: CardFormData = {
              ...values,
              tags: {
                ...updatingItem?.tags,
                level: values.level,
                topics: values.topics
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t),
              },
              usageExamples,
              synonyms,
              antonyms,
              learningStatus: LearningStatus.NEW,
              reviewedNumber: 0,
              cardType: values.cardType,
              english: values.english.trim(),
              persian: values.persian.trim(),
            };

            addToExpressions(cardData)
              .then(() => {
                if (!updatingItem?.id) {
                  resetForm();
                  setUsageExamples([{ example: '', translation: '' }]);
                  setSynonyms(['']);
                  setAntonyms(['']);
                }
                setSubmitting(false);
                onUpdate?.();
              })
              .catch((error) => {
                console.error('Error saving card:', error);
                setSubmitting(false);
              });
          }}
          validationSchema={AddCardValidationSchema}
        >
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'basic')} className="mb-3">
                <Tab eventKey="basic" title="Basic Info">
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Label>Card Type *</Form.Label>
                      <div className="card-type-selector">
                        {Object.values(CardTypeEnum).map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={values.cardType === type ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setFieldValue('cardType', type)}
                            className="me-2 mb-2"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                      {errors.cardType && <Form.Text className="text-danger">{errors.cardType}</Form.Text>}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>English Core *</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="englishCore"
                            value={values.englishCore}
                            onChange={handleChange}
                            isInvalid={!!(errors.englishCore && touched.englishCore)}
                            placeholder="Main word/phrase"
                          />
                          <InputGroup.Text>
                            <Speaker text={values.englishCore} lang="en-US" />
                          </InputGroup.Text>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">{errors.englishCore}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Persian Core *</Form.Label>
                        <Form.Control
                          type="text"
                          name="persianCore"
                          value={values.persianCore}
                          onChange={handleChange}
                          isInvalid={!!(errors.persianCore && touched.persianCore)}
                          placeholder="کلمه/عبارت اصلی"
                          dir="rtl"
                        />
                        <Form.Control.Feedback type="invalid">{errors.persianCore}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>English Sentence *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="english"
                          value={values.english}
                          onChange={handleChange}
                          isInvalid={!!(errors.english && touched.english)}
                          placeholder="Complete sentence or context"
                        />
                        <Form.Control.Feedback type="invalid">{errors.english}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Persian Translation *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="persian"
                          value={values.persian}
                          onChange={handleChange}
                          isInvalid={!!(errors.persian && touched.persian)}
                          placeholder="ترجمه کامل یا متن"
                          dir="rtl"
                        />
                        <Form.Control.Feedback type="invalid">{errors.persian}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Part of Speech</Form.Label>
                        <Form.Select name="partOfSpeech" value={values.partOfSpeech} onChange={handleChange} title="Select part of speech for the card">
                          {Object.values(PartOfSpeech).map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Difficulty Level</Form.Label>
                        <Form.Select name="level" value={values.level} onChange={handleChange} title="Select difficulty level for the card">
                          {Object.values(DifficultyLevel).map((level) => (
                            <option key={level} value={level}>
                              {level.replace('_', ' ')}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="additional" title="Additional Info">
                  <Form.Group className="mb-3">
                    <Form.Label>Definition</Form.Label>
                    <Form.Control as="textarea" rows={2} name="definition" value={values.definition} onChange={handleChange} placeholder="English definition of the word/phrase" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="imageUrl"
                      value={values.imageUrl}
                      onChange={handleChange}
                      isInvalid={!!(errors.imageUrl && touched.imageUrl)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Topics (comma-separated)</Form.Label>
                    <Form.Control type="text" name="topics" value={values.topics} onChange={handleChange} placeholder="business, travel, food" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" rows={2} name="notes" value={values.notes} onChange={handleChange} placeholder="Personal notes or reminders" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mnemonics</Form.Label>
                    <Form.Control as="textarea" rows={2} name="mnemonics" value={values.mnemonics} onChange={handleChange} placeholder="Memory aids or tricks" />
                  </Form.Group>
                </Tab>

                <Tab eventKey="examples" title="Examples">
                  <div className="usage-examples-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6>Usage Examples</h6>
                      <Button variant="outline-primary" size="sm" onClick={addUsageExample}>
                        <Icon icon="mdi:plus" /> Add Example
                      </Button>
                    </div>

                    {usageExamples.map((example, index) => (
                      <Card key={index} className="example-card mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={5}>
                              <Form.Control type="text" placeholder="English example" value={example.example} onChange={(e) => updateUsageExample(index, 'example', e.target.value)} className="mb-2" />
                            </Col>
                            <Col md={5}>
                              <Form.Control
                                type="text"
                                placeholder="Persian translation"
                                value={example.translation}
                                onChange={(e) => updateUsageExample(index, 'translation', e.target.value)}
                                dir="rtl"
                                className="mb-2"
                              />
                            </Col>
                            <Col md={2} className="d-flex align-items-start">
                              <Button variant="outline-danger" size="sm" onClick={() => removeUsageExample(index)} disabled={usageExamples.length === 1}>
                                <Icon icon="mdi:trash-can" />
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey="words" title="Synonyms & Antonyms">
                  <Row>
                    <Col md={6}>
                      <div className="synonyms-section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Synonyms</h6>
                          <Button variant="outline-success" size="sm" onClick={addSynonym}>
                            <Icon icon="mdi:plus" />
                          </Button>
                        </div>

                        {synonyms.map((synonym, index) => (
                          <InputGroup key={index} className="mb-2">
                            <Form.Control type="text" placeholder="Synonym" value={synonym} onChange={(e) => updateSynonym(index, e.target.value)} />
                            <Button variant="outline-danger" onClick={() => removeSynonym(index)} disabled={synonyms.length === 1}>
                              <Icon icon="mdi:trash-can" />
                            </Button>
                          </InputGroup>
                        ))}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="antonyms-section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Antonyms</h6>
                          <Button variant="outline-warning" size="sm" onClick={addAntonym}>
                            <Icon icon="mdi:plus" />
                          </Button>
                        </div>

                        {antonyms.map((antonym, index) => (
                          <InputGroup key={index} className="mb-2">
                            <Form.Control type="text" placeholder="Antonym" value={antonym} onChange={(e) => updateAntonym(index, e.target.value)} />
                            <Button variant="outline-danger" onClick={() => removeAntonym(index)} disabled={antonyms.length === 1}>
                              <Icon icon="mdi:trash-can" />
                            </Button>
                          </InputGroup>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>

              <div className="form-actions">
                {updatingItem?.id ? (
                  <div className="d-flex gap-2">
                    <Button type="submit" disabled={isSubmitting} variant="success">
                      <Icon icon="mdi:content-save" className="me-1" />
                      Update
                    </Button>
                    {onClose && (
                      <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button type="submit" disabled={isSubmitting} variant="primary">
                    <Icon icon="mdi:plus" className="me-1" />
                    Add Card
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>

      {/* URL Extractor Modal */}
      <UrlExtractor
        show={showUrlExtractor}
        onClose={() => setShowUrlExtractor(false)}
        onDataExtracted={(data) => {
          setExtractedData(data);
          if (data.usageExamples?.length) {
            setUsageExamples(data.usageExamples);
          }
          if (data.synonyms?.length) {
            setSynonyms(data.synonyms);
          }
          if (data.antonyms?.length) {
            setAntonyms(data.antonyms);
          }
          setShowUrlExtractor(false);
        }}
        autoDetectCardType={true}
      />
    </Card>
  );
};

export default EnhancedAddEnglishCardForm;
