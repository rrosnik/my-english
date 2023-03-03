import React, { useEffect, useState } from 'react'
import { dbRefs, database, firebaseDatabase } from "../../firebase/index";
import { Formik } from 'formik';
import { DataSnapshot } from 'firebase/database';

import './index.scss';
import { ListGroup, InputGroup, Form, Button, Card } from 'react-bootstrap';

import AddEnglishCardForm from '../../components/organisms/forms/AddEnglishCardForm';

const InsertPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);

    useEffect(() => {

        console.log("useEffect");

        const queryRef = firebaseDatabase.query(
            dbRefs.expressionsRef,
            firebaseDatabase.limitToLast(5)
        );

        firebaseDatabase.onValue(queryRef, (data: DataSnapshot) => {
            if (data == null || data === undefined) setExpressions([]);
            else if (data.val() instanceof Array) setExpressions(data.val());
            else {
                const result: Array<any> = [];
                Object.keys(data.val()).forEach((v, i) => {
                    result.push({ id: v, ...data.val()[v] });
                });
                setExpressions(result.reverse());
            }
        });

        return () => {
            firebaseDatabase.off(queryRef);
        };
    }, [update]);

    return (
        <div className='page insert-page'>
            <AddEnglishCardForm />
            <div className='newly-added-cards'>
                <ListGroup>
                    {
                        expressions.map((value, index) => (
                            <ListGroup.Item key={value.id}>
                                <div >
                                    <div dir='rtl'>{value.persian}</div>
                                    <div dir='rtl'>{value.persianCore}</div>
                                    <div>{value.english}</div>
                                    <div>{value.englishCore}</div>
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