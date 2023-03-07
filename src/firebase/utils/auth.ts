import firebase from "../config";
import { UserType } from "../../redux/reducers/userReducer";
import { User, UserCredential } from "@firebase/auth";


export const signInWithEmailAndPassword = (email: string, password: string): Promise<UserType> => {
    return firebase.auths.signInWithEmailAndPassword(firebase.auth, email, password)
        .then<UserType>(credential => {
            return credential.user.toJSON() as UserType;
        });
};

export const signOut = (): Promise<void> => {
    return firebase.auths.signOut(firebase.auth);
};

export const createUserWithEmailAndPassword = (email: string, password: string): Promise<UserCredential> => {
    return firebase.auths.createUserWithEmailAndPassword(firebase.auth, email, password);
};

