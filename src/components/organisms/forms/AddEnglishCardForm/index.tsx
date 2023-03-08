import { Formik, FormikErrors } from 'formik';
import { InputGroup, Form, Button, Card, Row, Col } from 'react-bootstrap';
import firebase from "../../../../firebase";
import { EnglishCard } from '../../../../types';
import * as yup from "yup";


const AddCardVlidationSchema = yup.object({
    persian: yup.string().required("The field is required"),
    persianCore: yup.string().required("The field is required"),
    english: yup.string().required("The field is required"),
    englishCore: yup.string().required("The field is required"),
});
const AddEnglishCardForm = (props: any) => {
    const { setName }: { setName: string } = props;
    const addToExpressions = (data: EnglishCard) => {
        return firebase.utils.fsDatabase.addItem(setName, {
            ...data,
            created_at: Date.now(),
            updated_at: Date.now(),
            reviewedNumber: 0
        });
    }

    const focusOrSubmit = (e: React.KeyboardEvent<HTMLFormElement>, errors: FormikErrors<{
        persian: string;
        persianCore: string;
        english: string;
        englishCore: string;
    }>) => {
        // this is for acting enter button like tab button 
        if (["Enter"].includes(e.key)) {
            const targetForm: HTMLFormElement = (e.target as HTMLInputElement).form as HTMLFormElement;
            const collection: NodeListOf<Element> = targetForm.querySelectorAll("input,textarea");
            const inputs: Array<HTMLInputElement | HTMLTextAreaElement> = [...collection] as Array<HTMLInputElement | HTMLTextAreaElement>;
            let index: number = inputs.indexOf(e.target as HTMLInputElement | HTMLTextAreaElement);


            // if there is next input form shouldn't be submitted 
            // instead focus should be changed
            if (inputs[index].getAttribute("enterKeyHint") !== 'send' && inputs[index].tagName !== "TEXTAREA") {
                console.log("adasdadasd")
                e.preventDefault();
            }
            console.log(inputs[index].tagName);
            if (inputs[index].tagName !== "TEXTAREA") {
                index = index === 3 ? 0 : index + 1;
                inputs[index].focus();
                if (index === 0) {
                    Object.keys(errors).reverse().forEach(ep => {
                        if (!!errors[ep as 'persian' | 'persianCore' | 'english' | 'englishCore']) {
                            const elem = inputs.find(el => el.name === ep) as HTMLInputElement | HTMLTextAreaElement;
                            elem.textContent = '';
                            elem.focus();
                        }
                    });
                }
            }
        }
    }
    return (
        <Card className="add-english-card-form">
            <Card.Header>Add an English card</Card.Header>
            <Card.Body>
                <Formik
                    initialValues={{ persian: '', persianCore: '', english: '', englishCore: '' }}
                    onSubmit={(values, { setSubmitting, resetForm, setFieldError, }) => {
                        addToExpressions(values as EnglishCard).then(() => {
                            props.update();
                            resetForm();
                        });

                    }}
                    validationSchema={AddCardVlidationSchema}
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
                        <form
                            onKeyDown={(e) => focusOrSubmit(e, errors)}
                            onSubmit={handleSubmit}
                        >
                            <Row>
                                <InputGroup className="mb-3" hasValidation>
                                    <Form.Control
                                        enterKeyHint='next'
                                        type="text"
                                        name="persianCore"
                                        onChange={handleChange}
                                        value={values.persianCore}
                                        dir="rtl"
                                        isInvalid={!!errors.persianCore && !!touched.persianCore}
                                    />
                                    <InputGroup.Text id="inputGroup-sizing-sm">هسته</InputGroup.Text>
                                    <Form.Control.Feedback type='invalid'>{errors.persianCore}</Form.Control.Feedback>
                                </InputGroup>
                            </Row>
                            <Row>
                                <InputGroup className="mb-3" hasValidation>
                                    <Form.Control
                                        as='textarea'
                                        rows={5}
                                        cols={20}
                                        type="text"
                                        name="persian"
                                        onChange={handleChange}
                                        value={values.persian}
                                        dir="rtl"
                                        isInvalid={!!errors.persian && !!touched.persian}
                                    />
                                    <InputGroup.Text>جمله</InputGroup.Text>
                                    <Form.Control.Feedback type='invalid'>{errors.persian}</Form.Control.Feedback>
                                </InputGroup>
                            </Row>

                            <Row>
                                <InputGroup className="mb-3" hasValidation>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Core</InputGroup.Text>
                                    <Form.Control
                                        enterKeyHint='next'
                                        type="text"
                                        name="englishCore"
                                        onChange={handleChange}
                                        value={values.englishCore}
                                        isInvalid={!!errors.englishCore && !!touched.englishCore}
                                    />
                                    <Form.Control.Feedback type='invalid'>errors.englishCore</Form.Control.Feedback>
                                </InputGroup>
                            </Row>
                            <Row>
                                <InputGroup className="mb-3" hasValidation>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Sentence</InputGroup.Text>
                                    <Form.Control
                                        as='textarea'
                                        rows={5}
                                        type="text"
                                        name="english"
                                        onChange={handleChange}
                                        value={values.english}
                                        isInvalid={!!errors.english && !!touched.english}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.english}</Form.Control.Feedback>
                                </InputGroup>
                            </Row>

                            <div>
                                <Button type="submit" disabled={isSubmitting} variant="primary">
                                    Save
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card.Body>
        </Card >
    )
}

export default AddEnglishCardForm;