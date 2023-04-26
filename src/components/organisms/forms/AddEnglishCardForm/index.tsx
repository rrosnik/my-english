import { Formik, FormikErrors } from 'formik';
import { InputGroup, Form, Button, Card, Row, Col } from 'react-bootstrap';
import firebase from "../../../../firebase";
import { EnglishCard, CardType, CardTypeEnum } from '../../../../types';
import * as yup from "yup";


import "./index.scss";


const AddCardVlidationSchema = yup.object({
    id: yup.string().notRequired(),
    persian: yup.string().required("The field is required"),
    persianCore: yup.string().required("The field is required"),
    english: yup.string().required("The field is required"),
    englishCore: yup.string().required("The field is required"),
    cardType: yup.mixed()
        .oneOf(Object.values(CardTypeEnum), "the type is incorrect")
        .required("The type of card should be selected"),
    imageUrl: yup.string().url("this field should be Image URL").notRequired(),
});
const AddEnglishCardForm = (props: any) => {

    const { setName, updatingItem }: { setName: string, updatingItem?: EnglishCard } = props;

    const addToExpressions = (data: EnglishCard) => {
        console.log(data);

        const input: EnglishCard = {
            ...data,
            created_at: data.created_at ?? Date.now(),
            updated_at: Date.now(),
            reviewedNumber: data.reviewedNumber ?? 0
        };
        delete input.id;

        if (!updatingItem?.id) {
            return firebase.utils.fsDatabase.addItem(setName, input);
        }
        else {
            console.log('updatingItem', updatingItem);
            return firebase.utils.fsDatabase.updateItem(setName, updatingItem.id, input);
        }
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
            <Card.Header>
                {updatingItem?.id
                    ? 'Update Form'
                    : 'Add Form'
                }
            </Card.Header>
            <Card.Body>
                <Formik
                    initialValues={{
                        id: updatingItem?.id,
                        persian: updatingItem?.persian ?? '',
                        persianCore: updatingItem?.persianCore ?? '',
                        english: updatingItem?.english ?? '',
                        englishCore: updatingItem?.englishCore ?? '',
                        cardType: updatingItem?.cardType ?? '',
                        imageUrl: updatingItem?.imageUrl ?? '',
                    }}
                    onSubmit={(values, { resetForm, setSubmitting }) => {
                        console.log(values)
                        addToExpressions(values as EnglishCard)
                            .then(() => {
                                !updatingItem?.id && resetForm();
                                setSubmitting(false);
                                props.update?.();
                            });

                    }}
                    validationSchema={AddCardVlidationSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Row >
                                <Form.Text className="text-danger">{errors.cardType}</Form.Text>
                                <div
                                    className={`card-type ${errors.cardType ? "is-invalid" : ""}`}


                                >
                                    {
                                        Object.values(CardTypeEnum).map((type, index) => {
                                            return (
                                                <button
                                                    className={`${values.cardType === type ? 'active' : ''}`}
                                                    type="button"
                                                    onClick={() => setFieldValue("cardType", values.cardType === type ? '' : type)}
                                                >
                                                    {type}
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                            </Row>
                            <Row>
                                <InputGroup className="mb-3" hasValidation>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Image URL</InputGroup.Text>
                                    <Form.Control
                                        enterKeyHint='next'
                                        type="url"
                                        name="imageUrl"
                                        onChange={handleChange}
                                        value={values.imageUrl}
                                        isInvalid={!!errors.imageUrl && !!touched.imageUrl}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.imageUrl}</Form.Control.Feedback>
                                </InputGroup>
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
                                {updatingItem?.id

                                    ?
                                    <div className='d-flex gap-2'>
                                        <Button type="submit" disabled={isSubmitting} variant="success">
                                            Update
                                        </Button>
                                        <Button type="button" disabled={isSubmitting} variant="secondary" onClick={() => {
                                            props.onClose?.()
                                        }}>
                                            Cancel
                                        </Button>
                                    </div>
                                    : <Button type="submit" disabled={isSubmitting} variant="primary">
                                        Save
                                    </Button>

                                }

                            </div>
                        </form>
                    )}
                </Formik>
            </Card.Body>
        </Card >
    )
}

export default AddEnglishCardForm;