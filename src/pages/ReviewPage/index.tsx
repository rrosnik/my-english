import { DataSnapshot } from 'firebase/database';
import React, { useState, useEffect, useCallback } from 'react'
import firebase from "../../firebase";
import { ListGroup, Badge } from 'react-bootstrap';
import { EnglishCard } from "../../types";
import { useParams } from 'react-router-dom';
import router from '../../router';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';




const EnglishReviewCard = (props: any) => {
    const { item, colId }: { item: EnglishCard, colId: string } = props;
    const [cardState, setCardState] = useState<number>(item.persian ? 1 : 2);

    const increaseState = () => {
        console.log(cardState);
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
        console.log(finalIncrease);

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
        firebase.rtDatabase.update(firebase.rtDbRefs.expressionsRef, {
            [item.id as string]: updatingData
        })
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

    const getItems = useCallback<(setName: string) => Promise<Array<any>>>((colId: string) => {
        return firebase.utils.fsDatabase.getItems(colId)
            .then<Array<any>>(items => {
                setExpressions(items);
                return items;
            });
    }, []);

    useEffect(() => {
        console.log("useEffect review");
        getItems(params.colId as string);
        return () => { };
    }, [update, getItems]);

    return (
        <div className='page review-page'>
            count of items: {expressions.length}
            <ListGroup>
                {
                    expressions.map((value, index) => (
                        <ListGroup.Item key={index}>
                            <EnglishReviewCard item={value} colId={params.colId} />
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>

        </div>
    )
}

export default ReviewPage;