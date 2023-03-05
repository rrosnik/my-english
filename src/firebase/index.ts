// Import the functions you need from the SDKs you need
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import * as firebaseDatabase from "firebase/database"


import appConfig from "./config.json";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = firebaseApp.initializeApp(appConfig);
// const analytics = getAnalytics(app);
const database = firebaseDatabase.getDatabase(app);

const dbRefs = {
    expressionsRef: firebaseDatabase.ref(database, "expressions"),
};

const auth = firebaseAuth.getAuth(app);

export {
    firebaseDatabase,
    firebaseAuth,
    app,
    dbRefs,
    auth,
    database,
};