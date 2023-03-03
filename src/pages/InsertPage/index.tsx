import React, { useEffect, useState } from 'react'
import { dbRefs, database, firebaseDatabase } from "../../firebase/index";
import { Formik } from 'formik';
import { DataSnapshot } from 'firebase/database';

import './index.scss';

type Expression = {
    persian: string,
    persianCore: string,
    english: string;
    englishCore: string;
};


const InsertPage = () => {
    const [update, setUpdate] = useState<number>();
    const [expressions, setExpressions] = useState<Array<any>>([]);

    useEffect(() => {
        console.log("useEffect");
        firebaseDatabase.onValue(dbRefs.expressionsRef, (data: DataSnapshot) => {
            if (data == null || data === undefined) setExpressions([]);
            else if (data.val() instanceof Array) setExpressions(data.val());
            else {
                const result: Array<any> = [];
                Object.keys(data.val()).forEach((v, i) => {
                    result.push({ id: v, ...data.val()[v] });
                });
                setExpressions(result);
                console.log(result);
            }
        });

        return () => { };
    }, [update]);


    const addToExpressions = (data: Expression) => {
        firebaseDatabase.push(dbRefs.expressionsRef, {
            ...data,
            create_at: Date.now(),
            reviewedNumber: 0
        });
    }

    return (
        <div className='insert-page'>
            <div className='inner-container'></div>
            <div>
                <Formik
                    initialValues={{ persian: '', persianCore: '', english: '', englishCore: '' }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        addToExpressions(values as Expression);
                        resetForm();
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>persian</label>
                                <input
                                    type="text"
                                    name="persian"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.persian}
                                    dir="rtl"
                                />
                                {errors.persian && touched.persian && errors.persian}
                                <label>persian Core</label>
                                <input
                                    type="text"
                                    name="persianCore"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.persianCore}
                                    dir="rtl"
                                />
                                {errors.persianCore && touched.persianCore && errors.persianCore}
                            </div>
                            <div>
                                <label>english</label>
                                <input
                                    type="text"
                                    name="english"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.english}
                                />
                                {errors.english && touched.english && errors.english}
                                <label>english Core</label>
                                <input
                                    type="text"
                                    name="englishCore"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.englishCore}
                                />
                                {errors.englishCore && touched.englishCore && errors.englishCore}

                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitting}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            <div>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>english</th>
                            <th>expression</th>
                            <th>عبارت</th>
                            <th>فارسی</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expressions.map((value, index) => (
                                <tr key={index}>
                                    <td>{value.english}</td>
                                    <td>{value.englishCore}</td>
                                    <td dir='rtl'>{value.persianCore}</td>
                                    <td dir='rtl'>{value.persian}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default InsertPage;