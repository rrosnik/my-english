import React from 'react'
import { Formik } from 'formik';
import { firebaseAuth, auth } from "../../firebase";

const SignupPage = () => {

    firebaseAuth
        .createUserWithEmailAndPassword(auth, "reza3ker372@gmail.com", "3321910764")
        .then((credential: firebaseAuth.UserCredential) => {
            console.log('credential', credential)
        })
        .catch((error) => {

        });



    return (
        <div>
            <Formik
                initialValues={{ persian: '', persianCore: '', english: '', englishCore: '' }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    // addToExpressions(values as EnglishCard);
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
                    handleReset,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <h3>Sign Up</h3>
                        <div className="mb-3">
                            <label>First name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First name"
                            />
                        </div>
                        <div className="mb-3">
                            <label>Last name</label>
                            <input type="text" className="form-control" placeholder="Last name" />
                        </div>
                        <div className="mb-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Already registered <a href="/sign-in">sign in?</a>
                        </p>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default SignupPage;