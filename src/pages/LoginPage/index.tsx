import React, { useEffect } from 'react';
import 'firebase/compat/auth';
import { auth, firebaseAuth } from "../../firebase";



const LoginPage = () => {

    useEffect(() => {
        const unsubscribeOnAuth = firebaseAuth.onAuthStateChanged(auth, (user) => {
            console.log('user', user);
        });
        return () => { unsubscribeOnAuth(); }
    }, []);

    return (
        <div>
      adadasds
        </div>

    )
}

export default LoginPage;