import React, { useCallback, useEffect, useState } from 'react'
import firebase from "../../firebase";
import { Formik } from 'formik';
import { DataSnapshot } from 'firebase/database';

import './index.scss';
import { ListGroup, InputGroup, Form, Button, Card, Badge } from 'react-bootstrap';

import AddEnglishCardForm from '../../components/organisms/forms/AddEnglishCardForm';
import { useParams } from 'react-router-dom';

const InsertPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);
    const params = useParams<{ colId: string }>();
    const getData = useCallback<(setName: string) => Promise<Array<any>>>((colId: string) => {
        return firebase.utils.fsDatabase.getItems(colId)
            .then<Array<any>>(items => {
                setExpressions(items);
                return items;
            });
    }, []);

    useEffect(() => {
        console.log("useEffect");
        getData(params.colId as string);
        return () => { };
    }, [getData, update]);

    return (
        <div className='page insert-page'>
            <AddEnglishCardForm setName={params.colId} update={() => getData(params.colId as string)} />
            <div className='newly-added-cards'>
                <ListGroup>
                    {
                        expressions.slice(0,1).map((value, index) => (
                            <ListGroup.Item key={index}>
                                <div >
                                    <div dir='rtl'>{value.persian}</div>
                                    <div dir='rtl'><Badge bg='danger'>{value.persianCore}</Badge></div>
                                    <div><Badge bg='success'>{value.englishCore}</Badge></div>
                                    <div>{value.english}</div>
                                </div>
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </div>
        </div>
    )
}

export default InsertPage;