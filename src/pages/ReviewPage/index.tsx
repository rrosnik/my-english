import { DataSnapshot } from 'firebase/database';
import React, { useState, useEffect, useCallback } from 'react'
import firebase from "../../firebase";
import { ListGroup, Badge, Card, Button } from 'react-bootstrap';
import { EnglishCard } from "../../types";
import { useParams } from 'react-router-dom';
import router from '../../router';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@iconify/react';
import "./index.scss";
import Speaker from '../../components/molecules/Speaker';

const EachEnglishCard = (props: any) => {
    const { item, colId, getItems }: { item: EnglishCard, colId: string, getItems: Function } = props;
    const [reviewMode, setReviewMode] = useState<boolean>(true);

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
        <Card className='english-card-review' dir={reviewMode ? 'rtl' : 'ltr'}>
            <Card.Header>
                {reviewMode ? item.persianCore : item.englishCore}
                <Speaker
                    text={reviewMode ? '' : item.englishCore}
                    lang={reviewMode ? 'fa' : 'en'} />
            </Card.Header>
            <Card.Body>
                <ReactMarkdown>
                    {reviewMode ? item.persian : item.english}
                </ReactMarkdown>
                <Speaker
                    text={reviewMode ? '' : item.english}
                    lang={reviewMode ? 'fa' : 'en'} />
            </Card.Body>
            <Card.Footer>
                <div className='d-flex justify-content-between'>

                    {!reviewMode && <Button type="button" variant='success'>
                        <Icon icon="line-md:confirm-circle" width="24" height="24" onClick={updateRecord} />
                    </Button>
                    }
                    <Button type="button" variant='primary' onClick={() => setReviewMode(!reviewMode)}>
                        <Icon icon="ic:sharp-loop" width="24" height="24" />
                    </Button>
                </div>
                <Badge bg="success">
                </Badge>
            </Card.Footer>
        </Card>
    );
};

const ReviewPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);
    const params = useParams<{ colId: string }>();

    const getItems = (colId: string) => {
        return firebase.utils.fsDatabase.getItems(colId)
            .then<Array<any>>(items => {
                setExpressions(items);
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
            <div className='review-items'>
                {
                    expressions.map((value, index) => (
                        <EachEnglishCard key={value.id} item={value} colId={params.colId} getItems={getItems} ></EachEnglishCard>
                    ))
                }
            </div>
        </div>
    )
}

export default ReviewPage;