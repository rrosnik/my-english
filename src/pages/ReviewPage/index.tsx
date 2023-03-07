import { DataSnapshot } from 'firebase/database';
import React, { useState, useEffect, useCallback } from 'react'
import firebase from "../../firebase";
import { ListGroup, Badge } from 'react-bootstrap';
import { EnglishCard } from "../../types";
import { useParams } from 'react-router-dom';
import router from '../../router';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

import "./index.scss";


const EnglishReviewCard = (props: any) => {
    const { item, colId, getItems }: { item: EnglishCard, colId: string, getItems: Function } = props;
    const [cardState, setCardState] = useState<number>(item.persian ? 1 : 2);

    const increaseState = () => {
        let finalIncrease = 1;
        if (cardState === 1)
            finalIncrease = item.persianCore ? 2 : (item.englishCore ? 3 : (item.english ? 4 : (item.persian ? 1 : 2)));
        else if (cardState === 2)
            finalIncrease = item.englishCore ? 3 : (item.english ? 4 : (item.persian ? 1 : 2));
        else if (cardState === 3)
            finalIncrease = item.english ? 4 : (item.persian ? 1 : 2);
        else if (cardState === 4) {
            finalIncrease = item.persian ? 1 : 2;
        }

        if (finalIncrease < cardState)
            updateRecord();
        setCardState(finalIncrease);
    }

    const updateRecord = () => {
        const updatingData: EnglishCard = {
            ...item,
            reviewedNumber: ++item.reviewedNumber,
            updated_at: Date.now()
        };
        delete updatingData.id;
        firebase.utils.fsDatabase.updateItem(colId, item.id as string, updatingData)
            .then(() => {
                getItems(colId);
            });
    }

    return (
        <div className='english-card-review' onClick={increaseState}>
            <div dir='rtl'>{item.persian}</div>
            {cardState > 1 && <div dir='rtl'><Badge bg="danger">{item.persianCore}</Badge></div>}
            {cardState > 2 && <div><Badge bg="success">{item.englishCore}</Badge></div>}
            {cardState > 3 && <div>{item.english}</div>}
        </div>
    );
}

const ReviewPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);
    const params = useParams<{ colId: string }>();

    const getItems = (colId: string) => {
        return firebase.utils.fsDatabase.getItems(colId)
            .then<Array<any>>(items => {
                const sorted = items.sort((a, b) => a.reviewedNumber - b.reviewedNumber || b.created_at - a.created_at);
                console.log(sorted);
                setExpressions(sorted);
                return items;
            });
    };

    useEffect(() => {
        getItems(params.colId as string);
        return () => { };
    }, [update]);

    return (
        <div className='page review-page'>
            count of items: {expressions.length}
            <ListGroup className='review-items'>
                {
                    expressions.map((value, index) => (
                        <ListGroup.Item key={(index + 1) * Math.random() * Math.random()}>
                            <EnglishReviewCard item={value} colId={params.colId} getItems={getItems} />
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
        </div>
    )
}

export default ReviewPage;