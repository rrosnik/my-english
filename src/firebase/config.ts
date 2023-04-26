// Import the functions you need from the SDKs you need
import * as fbApp from "firebase/app";
import * as fbAuth from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import * as rtDatabase from "firebase/database"
import * as fsDatabase from "firebase/firestore";
import appConfig from "./config.json";

import * as fbMessaging from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = fbApp.initializeApp(appConfig);

// real-time database
const rtDb = rtDatabase.getDatabase(app);

// firestore database
const fsDb = fsDatabase.getFirestore(app);

// refs for real-time database
const rtDbRefs = {
    expressionsRef: rtDatabase.ref(rtDb, "expressions"),
};
// refs for firestore database
const fsDbRefs = {
    dataColRef: () => fsDatabase.collection(fsDb, "data"),
    dataDocRef: (userId: string) => fsDatabase.doc(fsDbRefs.dataColRef(), userId),
    colRef: (userId: string, colId: string) => fsDatabase.collection(fsDbRefs.dataDocRef(userId), colId),
    docRef: (userId: string, colId: string, docId: string) => fsDatabase.doc(fsDbRefs.colRef(userId, colId), docId),
}


const auth = fbAuth.getAuth(app);




const msg = fbMessaging.getMessaging(app);




const firebase = {
    rtDatabase,
    auths: fbAuth,
    fsDatabase,
    app,
    auth,
    rtDb,
    fsDb,
    rtDbRefs,
    fsDbRefs,
};

export default firebase;