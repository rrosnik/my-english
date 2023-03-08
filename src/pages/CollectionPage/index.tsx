import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import firebase from '../../firebase';
import * as yup from "yup";

import "./index.scss";
import router from '../../router';




const CollectionPage = () => {
    const ref = useRef<HTMLInputElement>(null);
    const [colList, setColList] = useState<Array<string>>([]);

    const AddNewSetSchema = yup.object({
        setName: yup.string().required("please write a name").test({
            test: (value, context) => colList.every(col => col !== value),
            message: "this name is used before",
        }),
    });

    const getCollectionList = useCallback<() => void>(() => {
        firebase.utils.fsDatabase.getCollections().then(collections => {
            setColList(collections);
        });
    }, []);

    useEffect(() => {
        console.info("collection page");
        getCollectionList();
    }, [getCollectionList]);

    return (
        <div className='page collections-page'>
            {/* <Formik
                initialValues={{ setName: '', message: '' }}
                validationSchema={AddNewSetSchema}
                onSubmit={(vallues, { resetForm, setFieldError }) => {

                    // firebase.utils.fsDatabase.addNewSet(vallues.setName).catch(reason => {
                    //     console.log('reason', reason);
                    // });
                    // getCollectionList();
                    resetForm();
                    ref.current?.focus();
                }}
            >
                {({
                    values,
                    touched,
                    errors,
                    handleSubmit,
                    handleChange
                }) =>
                (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3" hasValidation>
                                    <InputGroup.Text>Name</InputGroup.Text>
                                    <Form.Control
                                        ref={ref}
                                        type="text"
                                        name="setName"
                                        placeholder="write a unique name"
                                        value={values.setName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.setName && !!touched.setName}
                                    />
                                    <Button type="submit">Add</Button>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.setName}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>
                )
                }
            </Formik> */}
            <ListGroup className="sets-items">
                {colList && colList.map(doc => {
                    return (<ListGroup.Item key={doc} className="set-item" >
                        {doc}

                        <div className='actions'>
                            <Button type="button" size='sm' onClick={() => {
                                router.navigate(`/${doc}/review`);
                            }}>Review</Button>
                            <Button type="button" size='sm' variant='warning' onClick={() => {
                                router.navigate(`/${doc}/insert`);
                            }}>Insert</Button>
                        </div>
                    </ListGroup.Item>)
                })}
            </ListGroup>
        </div >
    )
}

export default CollectionPage;