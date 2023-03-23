import { DataSnapshot } from 'firebase/database';
import React, { useState, useEffect, useCallback, useRef, Ref } from 'react'
import firebase from "../../firebase";
import { Badge, Card, Button } from 'react-bootstrap';
import { EnglishCard } from "../../types";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@iconify/react';
import "./index.scss";
import Speaker from '../../components/molecules/Speaker';
import UpdateCardAsModal from '../../components/layouts/UpdateCardAsModal';

const EachEnglishCard = (props: any) => {
    const { item, colId, getItems }: { item: EnglishCard, colId: string, getItems: Function } = props;
    const [reviewMode, setReviewMode] = useState<boolean>(true);
    const [isUpdatingMode, setIsUpdatingMode] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>();
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
        <Card className={`english-card-review ${item.cardType}`} dir={reviewMode ? 'rtl' : 'ltr'}>
            <Card.Header>
                <p>{reviewMode ? item.persianCore : item.englishCore}</p>
                <Speaker
                    text={reviewMode ? '' : item.englishCore}
                    lang={reviewMode ? 'fa' : 'en'} />
                {reviewMode && <Icon className='edit-icon' icon="material-symbols:edit" width="24" height="24" onClick={() => {
                    console.log("Adadasdasd");
                    modalRef.current?.showModal();
                    setIsUpdatingMode(true);

                }
                } />}
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

                    {!reviewMode &&
                        <Icon icon="line-md:confirm-circle" color="#198754" width="24" height="24" onClick={updateRecord} />
                    }
                    <Icon icon="ic:sharp-loop" color="#0d6efd" width="24" height="24" onClick={() => setReviewMode(!reviewMode)} />
                </div>
                <Badge bg="success">
                </Badge>
            </Card.Footer>
            <UpdateCardAsModal
                onUpdate={() => {
                    console.log("asssssssssssssssssss");
                    getItems(colId);
                }}
                setName={colId}
                ref={modalRef as Ref<HTMLDialogElement>} updatingItem={item}
            />
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