import { DocumentData, DocumentReference, DocumentSnapshot } from "@firebase/firestore";
import firebase from "..";
import { EnglishCard } from "../../types";

export const getCollections = () => {
    const colRef = firebase.fsDbRefs.dataDocRef(firebase.auth.currentUser?.uid as string);
    return firebase.fsDatabase.getDoc(colRef)
        .then<Array<string>>((value) => {
            return value.get("collections");
        })
};

// export const getSet = (setName: string) => {
//     const colRef = firebase.fsDbRefs.setDocRef(firebase.auth.currentUser?.uid as string, setName);
//     return firebase.fsDatabase.getDoc(colRef)
//         .then((value) => {
//             return value;
//         })
// };

export const getItems = (colId: string): Promise<Array<EnglishCard>> => {
    const colRef = firebase.fsDbRefs.colRef(firebase.auth.currentUser?.uid as string, colId);
    return firebase.fsDatabase.getDocs(colRef)
        .then<Array<EnglishCard>>((docs) => {
            const items: Array<EnglishCard> = [];
            docs.forEach(doc => {
                if (doc.id !== firebase.auth.currentUser?.uid)
                    items.push({ id: doc.id, ...doc.data() } as EnglishCard);
            });
            return items.sort((a, b) => a.reviewedNumber - b.reviewedNumber || b.created_at - a.created_at);
        })
};

// export const addNewSet = (setName: string): Promise<void> => {
//     const ref = firebase.fsDbRefs.setDocRef(firebase.auth.currentUser?.uid as string, setName);
//     return firebase.fsDatabase.setDoc(ref, { items: [] }, { merge: true, mergeFields: [] });
// };

export const deleteItem = (colId: string, docId: string): Promise<void> => {
    const ref = firebase.fsDbRefs.docRef(firebase.auth.currentUser?.uid as string, colId, docId);
    return firebase.fsDatabase.deleteDoc(ref);
}

export const addItem = (colId: string, item: EnglishCard): Promise<DocumentReference<DocumentData>> => {
    const ref = firebase.fsDbRefs.colRef(firebase.auth.currentUser?.uid as string, colId);
    return firebase.fsDatabase.addDoc(ref, item);
};

export const updateItem = (colId: string, docId: string, item: EnglishCard): Promise<void> => {

    console.log(firebase.auth.currentUser?.uid)
    console.log({ colId })
    console.log({ docId })
    const ref = firebase.fsDbRefs.docRef(firebase.auth.currentUser?.uid as string, colId, docId);
    return firebase.fsDatabase.updateDoc(ref, item);
};