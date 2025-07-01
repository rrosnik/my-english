import React from 'react';
import 'firebase/compat/auth';
import { Button, Card, Container, Form } from 'react-bootstrap';

import { Formik } from 'formik';
import * as yup from 'yup';

import './index.scss';
import apis from '../../apis';
import { Link } from 'react-router-dom';

const LoginValidationSchema = yup.object({
  email: yup.string().email('The email is invalid').required('Email is required!'),
  password: yup.string().required('Password is required!'),
});

const LoginPage = () => {
  return (
    <div className="page sign-in-page">
      <Container>
        <Card className="sign-in-pannel">
          <Card.Header>
            <h1>Sign In</h1>
            <p className="text-muted mb-0">Hi Dude, enjoy here</p>
          </Card.Header>
          <Card.Body>
            <Formik
              initialValues={{ email: '', password: '', message: '' }}
              onSubmit={(values, { setFieldError }) => {
                apis.auth
                  .signIn(values.email, values.password)
                  .then((user) => apis.auth.userSignedIn(user))
                  .catch((error) => {
                    console.log({ error });
                    switch (error.code) {
                      case 'auth/invalid-email':
                        setFieldError('email', 'email is invalid');
                        setFieldError('message', error.message);
                        break;
                      case 'auth/user-not-found':
                        setFieldError('email', 'Email not found');
                        break;
                      case 'auth/wrong-password':
                        setFieldError('password', 'Password is incorrect');
                        break;
                      case 'auth/too-many-requests':
                        setFieldError('message', error.message);
                        break;
                    }
                  });
              }}
              validationSchema={LoginValidationSchema}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Text className="text-danger">{errors.message}</Form.Text>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && !!errors.email}
                      inputMode="email"
                      autoComplete="email"
                    />
                    <Form.Control.Feedback type="valid">{errors.email}</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className=""
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && !!errors.password}
                    />
                    {<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                  </Form.Group>

                  <Button variant="primary" className="w-100" type="submit">
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>
            <Form.Text className="text-muted d-block text-center mt-4">
              you don&apos;t have account? <Link to="/sign-up">Sign Up</Link>
            </Form.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
