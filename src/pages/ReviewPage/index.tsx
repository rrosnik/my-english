import React, { useState, useEffect, useRef, Ref, useMemo } from 'react';
import firebase from '../../firebase';
import { Badge, Card } from 'react-bootstrap';
import { CardTypeEnum, EnglishCard } from '../../types';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@iconify/react';
import './index.scss';
import Speaker from '../../components/molecules/Speaker';
import UpdateCardAsModal from '../../components/layouts/UpdateCardAsModal';

type EachEnglishCardProps = {
  item: EnglishCard;
  colId: string;
  getItems: (colId: string) => Promise<Array<EnglishCard>>;
};

const EachEnglishCard = (props: EachEnglishCardProps) => {
  const { item, colId, getItems }: { item: EnglishCard; colId: string; getItems: (colId: string) => Promise<Array<EnglishCard>> } = props;
  const [reviewMode, setReviewMode] = useState<boolean>(true);
  const [, setIsUpdatingMode] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const updateRecord = () => {
    const updatingData: EnglishCard = {
      ...item,
      reviewedNumber: ++item.reviewedNumber,
      updated_at: Date.now(),
    };
    delete updatingData.id;
    firebase.utils.fsDatabase.updateItem(colId, item.id as string, updatingData).then(() => {
      getItems(colId);
    });
  };

  const hasImage = (cardInfo: EnglishCard) => {
    if (cardInfo.imageUrl) return true;
    return false;
  };
  return (
    <Card className={`english-card-review ${item.cardType}`} dir={reviewMode ? 'rtl' : 'ltr'}>
      <Card.Header>
        <p>{reviewMode ? item.persianCore : item.englishCore}</p>
        {!reviewMode && <Speaker text={reviewMode ? '' : item.englishCore} lang={reviewMode ? 'fa' : 'en'} />}
        {reviewMode && (
          <Icon
            className="edit-icon"
            icon="material-symbols:edit"
            width="24"
            height="24"
            onClick={() => {
              console.log('Adadasdasd');
              modalRef.current?.showModal();
              setIsUpdatingMode(true);
            }}
          />
        )}
      </Card.Header>
      <Card.Body>
        <ReactMarkdown>{reviewMode ? item.persian : item.english}</ReactMarkdown>
        {reviewMode ? hasImage(item) ? <img className="card-image" src={item.imageUrl as string} alt="card" /> : null : null}
        <Speaker text={reviewMode ? '' : item.english} lang={reviewMode ? 'fa' : 'en'} />
      </Card.Body>
      <Card.Footer>
        <div className="d-flex justify-content-between">
          {!reviewMode && <Icon icon="line-md:confirm-circle" color="#198754" width="24" height="24" onClick={updateRecord} />}
          <Icon icon="ic:sharp-loop" color="#0d6efd" width="24" height="24" onClick={() => setReviewMode(!reviewMode)} />
        </div>
        <Badge bg="success"></Badge>
      </Card.Footer>
      <UpdateCardAsModal
        onUpdate={() => {
          console.log('asssssssssssssssssss');
          getItems(colId);
        }}
        setName={() => {}}
        ref={modalRef as Ref<HTMLDialogElement>}
        updatingItem={item}
      />
    </Card>
  );
};

const ReviewPage = () => {
  const [update] = useState<number>();
  const [expressions, setExpressions] = useState<Array<EnglishCard>>([]);
  const params = useParams<{ colId: string }>();
  const [filter, setFilter] = useState<string | null>(null);

  const getItems = (colId: string) => {
    return firebase.utils.fsDatabase.getItems(colId).then<Array<EnglishCard>>((items) => {
      setExpressions(items);
      return items;
    });
  };

  const filteredItems = useMemo(() => {
    if (filter === '') return expressions.filter((card: EnglishCard) => !card.cardType);
    return expressions.filter((card: EnglishCard) => !filter || card.cardType === filter);
  }, [expressions, filter]);

  useEffect(() => {
    getItems(params.colId as string);
    return () => {};
  }, [update]);

  return (
    <div className="page review-page">
      <div className="filter-section">
        <p>counts: {filteredItems.length}</p>
        <div>
          {Object.values(CardTypeEnum).map((type, index) => {
            return (
              <button key={index} className={`${type} ${type === filter ? 'active' : ''}`} onClick={() => setFilter(filter === type ? null : type)}>
                {type}
              </button>
            );
          })}
          <button className={`${'' === filter ? 'active' : ''}`} onClick={() => setFilter(filter === '' ? null : '')}>
            Others
          </button>
        </div>
      </div>

      <div className="review-items">
        {filteredItems.map((value) => (
          <EachEnglishCard key={value.id} item={value} colId={params.colId || ''} getItems={getItems}></EachEnglishCard>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
