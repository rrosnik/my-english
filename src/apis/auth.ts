import { credential } from "firebase-admin";
import { auth, firebaseAuth } from "../firebase";
import actions from "../redux/actions";
import { UserType } from "../redux/reducers/userReducer";
import { store } from "../redux/store";
import router from "../router";


export const signInWithEmailAndPassword = (email: string, password: string) => {
    return firebaseAuth.signInWithEmailAndPassword(auth, email, password)
        .then<UserType>(credential => {
            return credential.user.toJSON() as UserType;
        });
};


export const userSignedIn = (user: UserType) => {
    store.dispatch(actions.userActions.setCurrentUser(user));
    router.navigate(router.basename + "/insert");
};

export const userSignedOut = () => {
    firebaseAuth.signOut(auth).then(() => {
        store.dispatch(actions.userActions.setCurrentUser(null));
        router.navigate(router.basename + "/sign-in");
    }).catch(reason => {
        console.log({ reason });
    });
};

export const alwaysCheckTheUserAuthStatus = () => {
    return firebaseAuth.onAuthStateChanged(auth, user => {
        if (!user) {
            store.dispatch(actions.userActions.setCurrentUser(null));
            router.navigate(router.basename + "/sign-in");
        } else {
            store.dispatch(actions.userActions.setCurrentUser(user.toJSON() as UserType));
            firebaseAuth.updateProfile(user, {
                displayName: "Reza Rostaminikoo"
              }).then(() => {
                // Profile updated!
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
              });
        }
    });
}