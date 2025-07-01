import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, ListGroup, Badge, Form, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { EnglishCard, UsageExample, ConfidenceLevel } from '@my-english/types';
import Speaker from '../../molecules/Speaker';
import UpdateCardAsModal from '../../layouts/UpdateCardAsModal';
import './index.scss';

interface CardActionsModalProps {
  show: boolean;
  onHide: () => void;
  card: EnglishCard;
  onUpdate: () => void;
}

const CardActionsModal: React.FC<CardActionsModalProps> = ({ show, onHide, card, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceLabel = (confidence: ConfidenceLevel) => {
    const labels = {
      [ConfidenceLevel.VERY_HARD]: 'Very Hard',
      [ConfidenceLevel.HARD]: 'Hard',
      [ConfidenceLevel.GOOD]: 'Good',
      [ConfidenceLevel.EASY]: 'Easy',
      [ConfidenceLevel.VERY_EASY]: 'Very Easy',
    };
    return labels[confidence] || 'Unknown';
  };

  const getConfidenceColor = (confidence: ConfidenceLevel) => {
    const colors = {
      [ConfidenceLevel.VERY_HARD]: 'danger',
      [ConfidenceLevel.HARD]: 'warning',
      [ConfidenceLevel.GOOD]: 'info',
      [ConfidenceLevel.EASY]: 'success',
      [ConfidenceLevel.VERY_EASY]: 'primary',
    };
    return colors[confidence] || 'secondary';
  };

  const calculateAccuracy = () => {
    const stats = card.reviewStats;
    if (!stats || stats.totalReviews === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalReviews) * 100);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Implementation depends on your firebase utils
      // await firebase.utils.fsDatabase.deleteItem(colId, card.id!);
      setShowDeleteConfirm(false);
      onHide();
      onUpdate();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" className="card-actions-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <Badge bg="primary" className={`card-type-${card.cardType} me-2`}>
              {card.cardType}
            </Badge>
            Card Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'details')} className="mb-3">
            <Tab eventKey="details" title="Details">
              <div className="card-details">
                <Row className="mb-3">
                  <Col md={6}>
                    <h5 className="mb-2">English</h5>
                    <div className="content-block">
                      <div className="main-text">{card.englishCore}</div>
                      <div className="context-text">{card.english}</div>
                      <div className="audio-controls mt-2">
                        <Speaker text={card.english} lang="en-US" />
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-2">Persian</h5>
                    <div className="content-block" dir="rtl">
                      <div className="main-text">{card.persianCore}</div>
                      <div className="context-text">{card.persian}</div>
                    </div>
                  </Col>
                </Row>

                {card.imageUrl && (
                  <Row className="mb-3">
                    <Col>
                      <h5>Image</h5>
                      <img src={card.imageUrl} alt={card.englishCore} className="card-detail-image" />
                    </Col>
                  </Row>
                )}

                {card.definition && (
                  <Row className="mb-3">
                    <Col>
                      <h5>Definition</h5>
                      <p className="definition-text">{card.definition}</p>
                    </Col>
                  </Row>
                )}

                {card.synonyms && card.synonyms.length > 0 && (
                  <Row className="mb-3">
                    <Col md={6}>
                      <h5>Synonyms</h5>
                      <div className="word-list">
                        {card.synonyms.map((synonym, index) => (
                          <Badge key={index} bg="info" className="me-1 mb-1">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </Col>
                    <Col md={6}>
                      {card.antonyms && card.antonyms.length > 0 && (
                        <>
                          <h5>Antonyms</h5>
                          <div className="word-list">
                            {card.antonyms.map((antonym, index) => (
                              <Badge key={index} bg="warning" className="me-1 mb-1">
                                {antonym}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                )}

                {card.notes && (
                  <Row className="mb-3">
                    <Col>
                      <h5>Notes</h5>
                      <p className="notes-text">{card.notes}</p>
                    </Col>
                  </Row>
                )}
              </div>
            </Tab>

            <Tab eventKey="examples" title="Examples">
              <div className="examples-section">
                {card.usageExamples && card.usageExamples.length > 0 ? (
                  <ListGroup>
                    {card.usageExamples.map((example: UsageExample, index: number) => (
                      <ListGroup.Item key={index} className="example-item">
                        <div className="english-example">{example.example}</div>
                        <div className="persian-example" dir="rtl">
                          {example.translation}
                        </div>
                        {example.context && (
                          <Badge bg="secondary" className="context-badge">
                            {example.context}
                          </Badge>
                        )}
                        {example.audioUrl && (
                          <div className="example-audio mt-2">
                            <Speaker text={example.example} lang="en-US" />
                          </div>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center text-muted py-4">
                    <Icon icon="mdi:text-box-outline" width="48" height="48" />
                    <p className="mt-2">No examples available</p>
                  </div>
                )}
              </div>
            </Tab>

            <Tab eventKey="stats" title="Statistics">
              <div className="stats-section">
                <Row>
                  <Col md={6}>
                    <div className="stat-card">
                      <h6>Review Count</h6>
                      <div className="stat-value">{card.reviewedNumber}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="stat-card">
                      <h6>Accuracy</h6>
                      <div className="stat-value">{calculateAccuracy()}%</div>
                    </div>
                  </Col>
                </Row>

                {card.reviewStats && (
                  <>
                    <Row className="mt-3">
                      <Col md={4}>
                        <div className="stat-card">
                          <h6>Total Reviews</h6>
                          <div className="stat-value">{card.reviewStats.totalReviews}</div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-card">
                          <h6>Correct</h6>
                          <div className="stat-value text-success">{card.reviewStats.correctAnswers}</div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-card">
                          <h6>Incorrect</h6>
                          <div className="stat-value text-danger">{card.reviewStats.incorrectAnswers}</div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <div className="stat-card">
                          <h6>Current Streak</h6>
                          <div className="stat-value">{card.reviewStats.streakCount}</div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="stat-card">
                          <h6>Lapses</h6>
                          <div className="stat-value">{card.reviewStats.lapses}</div>
                        </div>
                      </Col>
                    </Row>

                    {card.reviewStats.lastConfidenceLevel && (
                      <Row className="mt-3">
                        <Col>
                          <div className="stat-card">
                            <h6>Last Confidence</h6>
                            <Badge bg={getConfidenceColor(card.reviewStats.lastConfidenceLevel)}>{getConfidenceLabel(card.reviewStats.lastConfidenceLevel)}</Badge>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </>
                )}

                <Row className="mt-4">
                  <Col md={6}>
                    <div className="date-info">
                      <h6>Created</h6>
                      <small className="text-muted">{formatDate(card.created_at)}</small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="date-info">
                      <h6>Last Updated</h6>
                      <small className="text-muted">{formatDate(card.updated_at)}</small>
                    </div>
                  </Col>
                </Row>

                {card.lastReviewDate && (
                  <Row className="mt-2">
                    <Col>
                      <div className="date-info">
                        <h6>Last Reviewed</h6>
                        <small className="text-muted">{formatDate(card.lastReviewDate)}</small>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </Tab>

            <Tab eventKey="audio" title="Audio & Pronunciation">
              <div className="audio-section">
                <Row>
                  <Col>
                    <div className="pronunciation-controls">
                      <h5>Text-to-Speech</h5>
                      <div className="audio-options">
                        <Form.Group className="mb-3">
                          <Form.Label>Text to pronounce:</Form.Label>
                          <Form.Select>
                            <option value={card.englishCore}>{card.englishCore}</option>
                            <option value={card.english}>{card.english}</option>
                          </Form.Select>
                        </Form.Group>

                        <div className="speaker-controls">
                          <Speaker text={card.englishCore} lang="en-US" />
                          <span className="ms-2">Core word/phrase</span>
                        </div>

                        <div className="speaker-controls mt-2">
                          <Speaker text={card.english} lang="en-US" />
                          <span className="ms-2">Full sentence</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {card.audioData && (
                  <Row className="mt-4">
                    <Col>
                      <h5>Audio Data</h5>
                      {card.audioData.phoneticTranscription && (
                        <div className="phonetic-info">
                          <strong>Phonetic:</strong> /{card.audioData.phoneticTranscription}/
                        </div>
                      )}
                      {card.audioData.accentType && (
                        <div className="accent-info">
                          <strong>Accent:</strong> {card.audioData.accentType}
                        </div>
                      )}
                      {card.audioData.audioUrl && (
                        <div className="custom-audio mt-2">
                          <audio controls>
                            <source src={card.audioData.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              <Button variant="outline-danger" onClick={handleDelete}>
                <Icon icon="mdi:delete" className="me-1" />
                Delete
              </Button>
            </div>
            <div>
              <Button variant="outline-primary" onClick={handleEdit} className="me-2">
                <Icon icon="mdi:edit" className="me-1" />
                Edit
              </Button>
              <Button variant="secondary" onClick={onHide}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this card?</p>
          <div className="card-preview">
            <strong>{card.englishCore}</strong> - {card.persianCore}
          </div>
          <p className="text-danger mt-2">
            <small>This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Card
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      {showEditModal && <UpdateCardAsModal updatingItem={card} setName={() => {}} key={card.id} />}
    </>
  );
};

export default CardActionsModal;
