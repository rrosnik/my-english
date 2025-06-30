import React, { useCallback, useEffect, useState } from 'react';
import firebase from '../../firebase';

import './index.scss';
import { ListGroup, Badge } from 'react-bootstrap';

import AddEnglishCardForm from '../../components/organisms/forms/AddEnglishCardForm';
import { useParams } from 'react-router-dom';
import { EnglishCard } from '../../types';

const InsertPage = () => {
  const [update] = useState<number>();
  const [expressions, setExpressions] = useState<Array<EnglishCard>>([]); // Use a more specific type if possible
  const params = useParams<{ colId: string }>();
  const getData = useCallback<(setName: string) => Promise<Array<EnglishCard>>>((colId: string) => {
    return firebase.utils.fsDatabase.getItems(colId).then<Array<EnglishCard>>((items) => {
      setExpressions(items);
      return items;
    });
  }, []);

  useEffect(() => {
    console.log('useEffect');
    getData(params.colId as string);
    return () => {};
  }, [getData, update]);

  return (
    <div className="page insert-page">
      <AddEnglishCardForm setName={params.colId || ''} update={() => getData(params.colId as string)} />
      <div className="newly-added-cards">
        <ListGroup>
          {expressions.slice(0, 1).map((value, index) => (
            <ListGroup.Item key={index}>
              <div>
                <div dir="rtl">{value.persian}</div>
                <div dir="rtl">
                  <Badge bg="danger">{value.persianCore}</Badge>
                </div>
                <div>
                  <Badge bg="success">{value.englishCore}</Badge>
                </div>
                <div>{value.english}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default InsertPage;
