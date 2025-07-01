import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, ButtonGroup, Container, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import firebase from '../../firebase';
import { EnglishCard, ConfidenceLevel } from '@my-english/types';
import Speaker from '../../components/molecules/Speaker';
import CardActionsModal from '../../components/organisms/CardActionsModal';
import ReviewStatsPanel from '../../components/organisms/ReviewStatsPanel';
import './index.scss';

type CardReviewState = {
  isRevealed: boolean;
  startTime: number;
  userResponse?: ConfidenceLevel;
  responseTime?: number;
};

const CardByCardReviewPage = () => {
  const { colId } = useParams<{ colId: string }>();
  const [cards, setCards] = useState<EnglishCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStates, setCardStates] = useState<Map<string, CardReviewState>>(new Map());
  const [selectedCard, setSelectedCard] = useState<EnglishCard | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    correct: 0,
    incorrect: 0,
    totalTime: 0,
  });

  useEffect(() => {
    if (colId) {
      loadCards();
    }
  }, [colId]);

  const loadCards = async () => {
    try {
      const cardData = await firebase.utils.fsDatabase.getItems(colId as string);
      setCards(cardData);

      // Initialize card states
      const initialStates = new Map<string, CardReviewState>();
      cardData.forEach((card) => {
        initialStates.set(card.id!, {
          isRevealed: false,
          startTime: Date.now(),
        });
      });
      setCardStates(initialStates);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const currentCard = cards[currentIndex];
  const currentState = currentCard ? cardStates.get(currentCard.id!) : null;

  const revealCard = () => {
    if (!currentCard) return;

    setCardStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(currentCard.id!, {
        ...newStates.get(currentCard.id!)!,
        isRevealed: true,
        startTime: Date.now(),
      });
      return newStates;
    });
  };

  const handleResponse = (confidence: ConfidenceLevel) => {
    if (!currentCard || !currentState) return;

    const responseTime = Date.now() - currentState.startTime;
    const isCorrect = confidence >= ConfidenceLevel.GOOD;

    // Update card state
    setCardStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(currentCard.id!, {
        ...newStates.get(currentCard.id!)!,
        userResponse: confidence,
        responseTime,
      });
      return newStates;
    });

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      studied: prev.studied + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      totalTime: prev.totalTime + responseTime,
    }));

    // Update card in database
    updateCardProgress(currentCard.id!, confidence, responseTime);

    // Auto-advance to next card after a short delay
    setTimeout(() => {
      nextCard();
    }, 1500);
  };

  const updateCardProgress = async (cardId: string, confidence: ConfidenceLevel, responseTime: number) => {
    try {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const updatedCard: EnglishCard = {
        ...card,
        reviewedNumber: card.reviewedNumber + 1,
        updated_at: Date.now(),
        lastReviewDate: Date.now(),
        reviewStats: {
          ...card.reviewStats,
          totalReviews: (card.reviewStats?.totalReviews || 0) + 1,
          correctAnswers: confidence >= ConfidenceLevel.GOOD ? (card.reviewStats?.correctAnswers || 0) + 1 : card.reviewStats?.correctAnswers || 0,
          incorrectAnswers: confidence < ConfidenceLevel.GOOD ? (card.reviewStats?.incorrectAnswers || 0) + 1 : card.reviewStats?.incorrectAnswers || 0,
          averageResponseTime: responseTime,
          lastConfidenceLevel: confidence,
          streakCount: confidence >= ConfidenceLevel.GOOD ? (card.reviewStats?.streakCount || 0) + 1 : 0,
          lapses: confidence < ConfidenceLevel.GOOD ? (card.reviewStats?.lapses || 0) + 1 : card.reviewStats?.lapses || 0,
        },
      };

      await firebase.utils.fsDatabase.updateItem(colId as string, cardId, updatedCard);

      // Update local cards array
      setCards((prev) => prev.map((c) => (c.id === cardId ? updatedCard : c)));
    } catch (error) {
      console.error('Error updating card progress:', error);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  const resetCard = () => {
    if (!currentCard) return;

    setCardStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(currentCard.id!, {
        isRevealed: false,
        startTime: Date.now(),
      });
      return newStates;
    });
  };

  const openCardActions = () => {
    if (currentCard) {
      setSelectedCard(currentCard);
      setShowActionsModal(true);
    }
  };

  const getConfidenceLabel = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case ConfidenceLevel.VERY_HARD:
        return 'Very Hard';
      case ConfidenceLevel.HARD:
        return 'Hard';
      case ConfidenceLevel.GOOD:
        return 'Good';
      case ConfidenceLevel.EASY:
        return 'Easy';
      case ConfidenceLevel.VERY_EASY:
        return 'Very Easy';
      default:
        return 'Unknown';
    }
  };

  const getConfidenceColor = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case ConfidenceLevel.VERY_HARD:
        return 'danger';
      case ConfidenceLevel.HARD:
        return 'warning';
      case ConfidenceLevel.GOOD:
        return 'info';
      case ConfidenceLevel.EASY:
        return 'success';
      case ConfidenceLevel.VERY_EASY:
        return 'primary';
      default:
        return 'secondary';
    }
  };

  if (cards.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h3>Loading cards...</h3>
      </Container>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <Container className="text-center mt-5">
        <Card className="review-complete-card">
          <Card.Body>
            <Icon icon="mdi:check-circle" width="64" height="64" className="text-success mb-3" />
            <h3>Review Complete!</h3>
            <p>You&apos;ve reviewed all {cards.length} cards in this collection.</p>
            <ReviewStatsPanel stats={sessionStats} />
            <Button variant="primary" onClick={() => setCurrentIndex(0)} className="mt-3">
              Review Again
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div className="card-review-page">
      <Container>
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Card Review - {colId}</h2>
              <Badge bg="info">
                {currentIndex + 1} / {cards.length}
              </Badge>
            </div>
            <ProgressBar now={((currentIndex + 1) / cards.length) * 100} label={`${currentIndex + 1}/${cards.length}`} className="mb-3" />
          </Col>
          <Col md={4}>
            <ReviewStatsPanel stats={sessionStats} />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className={`review-card ${currentCard.cardType} ${currentState?.isRevealed ? 'revealed' : 'hidden'}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Badge bg="primary" className={`card-type-${currentCard.cardType}`}>
                    {currentCard.cardType}
                  </Badge>
                  {currentCard.reviewedNumber > 0 && (
                    <Badge bg="secondary" className="ms-2">
                      Reviewed {currentCard.reviewedNumber} times
                    </Badge>
                  )}
                </div>
                <div className="card-actions">
                  <Button variant="outline-secondary" size="sm" onClick={openCardActions}>
                    <Icon icon="mdi:dots-vertical" />
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="text-center">
                <div className="question-section mb-4">
                  <h3 className="english-text">{currentCard.englishCore}</h3>
                  <p className="english-context text-muted">{currentCard.english}</p>
                  <div className="audio-section mt-3">
                    <Speaker text={currentCard.english} lang="en-US" />
                  </div>
                </div>

                {currentState?.isRevealed ? (
                  <div className="answer-section">
                    <hr />
                    <h4 className="persian-text" dir="rtl">
                      {currentCard.persianCore}
                    </h4>
                    <p className="persian-context text-muted" dir="rtl">
                      {currentCard.persian}
                    </p>

                    {currentCard.imageUrl && (
                      <div className="image-section mt-3 mb-3">
                        <img src={currentCard.imageUrl} alt={currentCard.englishCore} className="card-image" />
                      </div>
                    )}

                    {!currentState.userResponse && (
                      <div className="confidence-section mt-4">
                        <h6>How well did you know this?</h6>
                        <ButtonGroup className="confidence-buttons">
                          <Button variant="outline-danger" onClick={() => handleResponse(ConfidenceLevel.VERY_HARD)}>
                            <div className="confidence-option">
                              <strong>1</strong>
                              <small>Very Hard</small>
                            </div>
                          </Button>
                          <Button variant="outline-warning" onClick={() => handleResponse(ConfidenceLevel.HARD)}>
                            <div className="confidence-option">
                              <strong>2</strong>
                              <small>Hard</small>
                            </div>
                          </Button>
                          <Button variant="outline-info" onClick={() => handleResponse(ConfidenceLevel.GOOD)}>
                            <div className="confidence-option">
                              <strong>3</strong>
                              <small>Good</small>
                            </div>
                          </Button>
                          <Button variant="outline-success" onClick={() => handleResponse(ConfidenceLevel.EASY)}>
                            <div className="confidence-option">
                              <strong>4</strong>
                              <small>Easy</small>
                            </div>
                          </Button>
                          <Button variant="outline-primary" onClick={() => handleResponse(ConfidenceLevel.VERY_EASY)}>
                            <div className="confidence-option">
                              <strong>5</strong>
                              <small>Very Easy</small>
                            </div>
                          </Button>
                        </ButtonGroup>
                      </div>
                    )}

                    {currentState.userResponse && (
                      <div className="response-feedback mt-4">
                        <Badge bg={getConfidenceColor(currentState.userResponse)} className="fs-6">
                          You rated this: {getConfidenceLabel(currentState.userResponse)}
                        </Badge>
                        <div className="mt-2">
                          <small className="text-muted">Response time: {currentState.responseTime ? Math.round(currentState.responseTime / 1000) : 0}s</small>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="reveal-section">
                    <Button variant="primary" size="lg" onClick={revealCard}>
                      <Icon icon="mdi:eye" className="me-2" />
                      Show Answer
                    </Button>
                  </div>
                )}
              </Card.Body>

              <Card.Footer>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="outline-secondary" onClick={previousCard} disabled={currentIndex === 0}>
                    <Icon icon="mdi:chevron-left" /> Previous
                  </Button>

                  <div className="middle-actions">
                    <Button variant="outline-info" size="sm" onClick={resetCard} className="me-2">
                      <Icon icon="mdi:refresh" />
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={() => goToCard(Math.floor(Math.random() * cards.length))}>
                      <Icon icon="mdi:shuffle" />
                    </Button>
                  </div>

                  <Button variant="outline-secondary" onClick={nextCard} disabled={currentIndex === cards.length - 1}>
                    Next <Icon icon="mdi:chevron-right" />
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        {selectedCard && <CardActionsModal show={showActionsModal} onHide={() => setShowActionsModal(false)} card={selectedCard} onUpdate={loadCards} />}
      </Container>
    </div>
  );
};

export default CardByCardReviewPage;
