import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import './index.scss';

interface ReviewStatsPanelProps {
  stats: {
    studied: number;
    correct: number;
    incorrect: number;
    totalTime: number;
  };
  className?: string;
}

const ReviewStatsPanel: React.FC<ReviewStatsPanelProps> = ({ stats, className = '' }) => {
  const accuracy = stats.studied > 0 ? Math.round((stats.correct / stats.studied) * 100) : 0;
  const averageTime = stats.studied > 0 ? Math.round(stats.totalTime / stats.studied / 1000) : 0;

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Card className={`review-stats-panel ${className}`}>
      <Card.Header className="d-flex align-items-center">
        <Icon icon="mdi:chart-line" className="me-2" />
        <span>Session Stats</span>
      </Card.Header>
      <Card.Body>
        <Row className="text-center">
          <Col xs={6} className="stat-item">
            <div className="stat-icon studied">
              <Icon icon="mdi:book-open-page-variant" />
            </div>
            <div className="stat-value">{stats.studied}</div>
            <div className="stat-label">Studied</div>
          </Col>
          <Col xs={6} className="stat-item">
            <div className="stat-icon accuracy">
              <Icon icon="mdi:target" />
            </div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </Col>
        </Row>

        <Row className="text-center mt-3">
          <Col xs={6} className="stat-item">
            <div className="stat-icon correct">
              <Icon icon="mdi:check-circle" />
            </div>
            <div className="stat-value text-success">{stats.correct}</div>
            <div className="stat-label">Correct</div>
          </Col>
          <Col xs={6} className="stat-item">
            <div className="stat-icon incorrect">
              <Icon icon="mdi:close-circle" />
            </div>
            <div className="stat-value text-danger">{stats.incorrect}</div>
            <div className="stat-label">Incorrect</div>
          </Col>
        </Row>

        {stats.studied > 0 && (
          <>
            <div className="accuracy-bar mt-3">
              <div className="d-flex justify-content-between mb-1">
                <small>Progress</small>
                <small>{accuracy}%</small>
              </div>
              <ProgressBar>
                <ProgressBar variant="success" now={(stats.correct / stats.studied) * 100} key={1} />
                <ProgressBar variant="danger" now={(stats.incorrect / stats.studied) * 100} key={2} />
              </ProgressBar>
            </div>

            <div className="time-stats mt-3">
              <Row className="text-center">
                <Col xs={6} className="time-item">
                  <Icon icon="mdi:clock-outline" className="time-icon" />
                  <div className="time-value">{formatTime(stats.totalTime)}</div>
                  <div className="time-label">Total Time</div>
                </Col>
                <Col xs={6} className="time-item">
                  <Icon icon="mdi:timer-outline" className="time-icon" />
                  <div className="time-value">{averageTime}s</div>
                  <div className="time-label">Avg. Time</div>
                </Col>
              </Row>
            </div>
          </>
        )}

        {stats.studied === 0 && (
          <div className="empty-state text-center mt-3">
            <Icon icon="mdi:chart-box-outline" width="32" height="32" className="text-muted" />
            <p className="text-muted mt-2 mb-0">Start reviewing to see stats</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewStatsPanel;
