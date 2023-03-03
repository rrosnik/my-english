import { Formik } from 'formik';
import { InputGroup, Form, Button, Card } from 'react-bootstrap';
import { dbRefs, firebaseDatabase } from "../../../../firebase";
import { EnglishCard } from '../../../../types';



const AddEnglishCardForm = () => {

    const addToExpressions = (data: EnglishCard) => {
        firebaseDatabase.push(dbRefs.expressionsRef, {
            ...data,
            created_at: Date.now(),
            updated_at: Date.now(),
            reviewedNumber: 0
        });
    }

    return (
        <Card className="add-english-card-form">
            <Card.Header>Add an English card</Card.Header>
            <Card.Body>
                <Formik
                    initialValues={{ persian: '', persianCore: '', english: '', englishCore: '' }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        addToExpressions(values as EnglishCard);
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
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="persian"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.persian}
                                        dir="rtl"
                                    />
                                    <InputGroup.Text>جمله</InputGroup.Text>
                                </InputGroup>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                {errors.persian && touched.persian && errors.persian}
                            </div>
                            <div>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="persianCore"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.persianCore}
                                        dir="rtl"
                                    />
                                    <InputGroup.Text id="inputGroup-sizing-sm">هسته</InputGroup.Text>
                                </InputGroup>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                {errors.persianCore && touched.persianCore && errors.persianCore}
                            </div>
                            <div>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">Sentence</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="english"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.english}
                                    />
                                </InputGroup>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                {errors.english && touched.english && errors.english}
                            </div>
                            <div>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="inputGroup-sizing-sm">Core</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="englishCore"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.englishCore}
                                    />
                                </InputGroup>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                {errors.englishCore && touched.englishCore && errors.englishCore}
                            </div>

                            <div>
                                <Button type="submit" disabled={isSubmitting} variant="primary">
                                    save
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default AddEnglishCardForm;