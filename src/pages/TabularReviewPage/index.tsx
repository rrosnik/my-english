import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Badge, ButtonGroup, Form, Container, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import firebase from '../../firebase';
import { EnglishCard, ConfidenceLevel, CardTypeEnum } from '../../types';
import Speaker from '../../components/molecules/Speaker';
import CardActionsModal from '../../components/organisms/CardActionsModal';
import ReviewStatsPanel from '../../components/organisms/ReviewStatsPanel';
import './index.scss';
import styled from '@emotion/styled';

const StyledTh = styled.th<{ width?: string }>`
  width: ${(props) => props.width || 'auto'};
  text-align: center;
  vertical-align: middle;
`;

type ReviewedCard = EnglishCard & {
  isRevealed: boolean;
  userResponse?: ConfidenceLevel;
  responseTime?: number;
  startTime?: number;
};

const TabularReviewPage = () => {
  const { colId } = useParams<{ colId: string }>();
  const [cards, setCards] = useState<ReviewedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<EnglishCard | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [filterType, setFilterType] = useState<CardTypeEnum | 'all'>('all');
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
      const reviewCards: ReviewedCard[] = cardData.map((card) => ({
        ...card,
        isRevealed: false,
        startTime: Date.now(),
      }));
      setCards(reviewCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const filteredCards = useMemo(() => {
    if (filterType === 'all') return cards;
    return cards.filter((card) => card.cardType === filterType);
  }, [cards, filterType]);

  const revealCard = (cardId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isRevealed: true, startTime: Date.now() } : card)));
  };

  const handleResponse = (cardId: string, confidence: ConfidenceLevel) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || !card.startTime) return;

    const responseTime = Date.now() - card.startTime;
    const isCorrect = confidence >= ConfidenceLevel.GOOD;

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, userResponse: confidence, responseTime } : c)));

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      studied: prev.studied + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      totalTime: prev.totalTime + responseTime,
    }));

    // Update card in database
    updateCardProgress(cardId, confidence, responseTime);
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
    } catch (error) {
      console.error('Error updating card progress:', error);
    }
  };

  const openCardActions = (card: EnglishCard) => {
    setSelectedCard(card);
    setShowActionsModal(true);
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

  const getCardStatusBadge = (card: ReviewedCard) => {
    if (card.userResponse) {
      return <Badge bg={getConfidenceColor(card.userResponse)}>Reviewed</Badge>;
    }
    if (card.isRevealed) {
      return <Badge bg="warning">Revealed</Badge>;
    }
    return <Badge bg="secondary">Hidden</Badge>;
  };

  return (
    <div className="tabular-review-page">
      <Container fluid>
        <Row className="mb-4">
          <Col md={8}>
            <h2>Tabular Review - {colId}</h2>
            <div className="d-flex gap-3 align-items-center mb-3">
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value as CardTypeEnum | 'all')} style={{ width: 'auto' }}>
                <option value="all">All Types</option>
                {Object.values(CardTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
              <Badge bg="info">{filteredCards.length} cards</Badge>
            </div>
          </Col>
          <Col md={4}>
            <ReviewStatsPanel stats={sessionStats} />
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover className="review-table">
            <thead>
              <tr>
                <StyledTh width="5%">#</StyledTh>
                <StyledTh width="15%">Type</StyledTh>
                <StyledTh width="25%">Question</StyledTh>
                <StyledTh width="25%">Answer</StyledTh>
                <StyledTh width="10%">Audio</StyledTh>
                <StyledTh width="10%">Status</StyledTh>
                <StyledTh width="10%">Actions</StyledTh>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card, index) => (
                <tr key={card.id} className={`card-row ${card.isRevealed ? 'revealed' : ''}`}>
                  <td>{index + 1}</td>
                  <td>
                    <Badge bg="primary" className={`card-type-${card.cardType}`}>
                      {card.cardType}
                    </Badge>
                  </td>
                  <td>
                    <div className="question-cell">
                      <div className="english-text">{card.englishCore}</div>
                      <small className="text-muted">{card.english}</small>
                    </div>
                  </td>
                  <td>
                    {card.isRevealed ? (
                      <div className="answer-cell">
                        <div className="persian-text" dir="rtl">
                          {card.persianCore}
                        </div>
                        <small className="text-muted" dir="rtl">
                          {card.persian}
                        </small>
                        {!card.userResponse && (
                          <div className="confidence-buttons mt-2">
                            <ButtonGroup size="sm">
                              <Button variant="outline-danger" onClick={() => handleResponse(card.id!, ConfidenceLevel.VERY_HARD)} title="Very Hard">
                                1
                              </Button>
                              <Button variant="outline-warning" onClick={() => handleResponse(card.id!, ConfidenceLevel.HARD)} title="Hard">
                                2
                              </Button>
                              <Button variant="outline-info" onClick={() => handleResponse(card.id!, ConfidenceLevel.GOOD)} title="Good">
                                3
                              </Button>
                              <Button variant="outline-success" onClick={() => handleResponse(card.id!, ConfidenceLevel.EASY)} title="Easy">
                                4
                              </Button>
                              <Button variant="outline-primary" onClick={() => handleResponse(card.id!, ConfidenceLevel.VERY_EASY)} title="Very Easy">
                                5
                              </Button>
                            </ButtonGroup>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button variant="outline-secondary" size="sm" onClick={() => revealCard(card.id!)}>
                        <Icon icon="mdi:eye" /> Reveal
                      </Button>
                    )}
                  </td>
                  <td>
                    <Speaker text={card.english} lang="en-US" />
                  </td>
                  <td>{getCardStatusBadge(card)}</td>
                  <td>
                    <Button variant="outline-info" size="sm" onClick={() => openCardActions(card)}>
                      <Icon icon="mdi:dots-vertical" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {selectedCard && <CardActionsModal show={showActionsModal} onHide={() => setShowActionsModal(false)} card={selectedCard} onUpdate={loadCards} />}
      </Container>
    </div>
  );
};

export default TabularReviewPage;
