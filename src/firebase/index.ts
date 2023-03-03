// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import * as firebaseDatabase from "firebase/database"

import config from "./config.json";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { ...config };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = firebaseDatabase.getDatabase(app);

const dbRefs = {
    expressionsRef: firebaseDatabase.ref(database, "expressions"),
};

export {
    firebaseDatabase,
    database,
    dbRefs,
};