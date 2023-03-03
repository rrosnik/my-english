import { DataSnapshot } from 'firebase/database';
import React, { useState, useEffect } from 'react'
import { dbRefs, database, firebaseDatabase } from "../../firebase/index";
import { ListGroup, Badge } from 'react-bootstrap';
import { EnglishCard } from "../../types";




const EnglishReviewCard = (props: any) => {
    const { info }: { info: EnglishCard } = props;
    const [cardState, setCardState] = useState<number>(info.persian ? 1 : 2);

    const increaseState = () => {
        console.log(cardState);
        let finalIncrease = 1;
        if (cardState === 1)
            finalIncrease = info.persianCore ? 2 : (info.englishCore ? 3 : (info.english ? 4 : (info.persian ? 1 : 2)));
        else if (cardState === 2)
            finalIncrease = info.englishCore ? 3 : (info.english ? 4 : (info.persian ? 1 : 2));
        else if (cardState === 3)
            finalIncrease = info.english ? 4 : (info.persian ? 1 : 2);
        else if (cardState === 4) {
            finalIncrease = info.persian ? 1 : 2;

        }

        if (finalIncrease < cardState)
            updateRecord();
        console.log(finalIncrease);

        setCardState(finalIncrease);
    }

    const updateRecord = () => {
        const updatingData: EnglishCard = {
            ...info,
            reviewedNumber: ++info.reviewedNumber,
            updated_at: Date.now()
        };
        delete updatingData.id;
        firebaseDatabase.update(dbRefs.expressionsRef, {
            [info.id as string]: updatingData
        })
    }
    return (
        <div className='english-card-review' onClick={increaseState}>
            <div dir='rtl'>{info.persian}</div>
            {cardState > 1 && <div dir='rtl'><Badge bg="danger">{info.persianCore}</Badge></div>}
            {cardState > 2 && <div><Badge bg="success">{info.englishCore}</Badge></div>}
            {cardState > 3 && <div>{info.english}</div>}
        </div>
    );
}







const ReviewPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);

    useEffect(() => {
        console.log("useEffect review");

        firebaseDatabase.onValue(dbRefs.expressionsRef, (data: DataSnapshot) => {
            if (data == null || data === undefined) setExpressions([]);
            else if (data.val() instanceof Array) setExpressions(data.val());
            else {
                const result: Array<any> = [];
                Object.keys(data.val()).forEach((v, i) => {
                    result.push({ id: v, ...data.val()[v] });
                });
                setExpressions(result.sort((a, b) => a.reviewedNumber - b.reviewedNumber));
            }
        });

        return () => {
            firebaseDatabase.off(dbRefs.expressionsRef);
        };
    }, [update]);

    return (
        <div className='page review-page'>
            count of items: {expressions.length}
            <ListGroup>
                {
                    expressions.map((value, index) => (
                        <ListGroup.Item key={value.id}>
                            <EnglishReviewCard info={value} />
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>

        </div>
    )
}

export default ReviewPage;