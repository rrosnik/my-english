import React from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';

import { Formik } from 'formik';
import * as yup from 'yup';

import apis from '../../apis';
import { UserType } from '../../redux/reducers/userReducer';
import { Link } from 'react-router-dom';

import './index.scss';

const LoginValidationSchema = yup.object({
  email: yup.string().email('The email is invalid').required('Email is required!'),
  password: yup.string().required('Password is required!'),
  displayName: yup.string().required('Display Name is required!'),
});

const SignupPage = () => {
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
              initialValues={{
                message: '',
                email: '',
                password: '',
                displayName: '',
              }}
              onSubmit={(values, { setFieldError }) => {
                apis.auth
                  .createUser(values.displayName, values.email, values.password)
                  .then((user: UserType) => {
                    console.log({ user });
                    apis.auth.userSignedIn(user);
                  })
                  .catch((error) => {
                    console.log({ error });
                    switch (error.code) {
                      case 'auth/invalid-email':
                        setFieldError('email', 'You cannot use this email');
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
                      case 'auth/email-already-in-use':
                        setFieldError('email', 'This email has already been registered');
                        break;
                      case 'auth/weak-password':
                        setFieldError('password', 'Pasword should be at least 6 characters');
                        break;
                    }
                  });
              }}
              validationSchema={LoginValidationSchema}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Text className="text-danger">{errors.message}</Form.Text>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className=""
                      type="displayName"
                      placeholder="displayName"
                      name="displayName"
                      value={values.displayName}
                      onChange={handleChange}
                      isInvalid={touched.displayName && !!errors.displayName}
                    />
                    {<Form.Control.Feedback type="invalid">{errors.displayName}</Form.Control.Feedback>}
                  </Form.Group>
                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-3">
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
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
            <Form.Text className="text-muted d-block text-center mt-4">
              Do you already ahve an account? <Link to="/sign-in">Sign In</Link>
            </Form.Text>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SignupPage;
