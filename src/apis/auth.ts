import { User } from "@firebase/auth-types";
import firebase from "../firebase";
import actions from "../redux/actions";
import { UserType } from "../redux/reducers/userReducer";
import { store } from "../redux/store";
import router from "../router";


export const signIn = (email: string, password: string): Promise<UserType> => {
    return firebase.utils.auth.signInWithEmailAndPassword(email, password);
};


export const userSignedIn = (user: UserType) => {
    store.dispatch(actions.userActions.setCurrentUser(user));
    router.navigate("/insert");
};

export const userSignedOut = () => {
    firebase.utils.auth.signOut().then(() => {
        store.dispatch(actions.userActions.setCurrentUser(null));
        router.navigate("/sign-in");
    }).catch(reason => {
        console.log({ reason });
    });
};

export const alwaysCheckTheUserAuthStatus = () => {
    return firebase.auths.onAuthStateChanged(firebase.auth, user => {
        console.warn('Auth State Listener', user);
        if (!user) {
            store.dispatch(actions.userActions.setCurrentUser(null));
            router.navigate("/sign-in");
        } else {
            store.dispatch(actions.userActions.setCurrentUser(user.toJSON() as UserType));
            store.dispatch(actions.app.changeStatus("ready"));
        }
    });
};


export const createUser = (displayName: string, email: string, password: string) => {
    // create user
    return firebase.utils.auth.createUserWithEmailAndPassword(email, password)
        .then<UserType>(userCredential => {
            // update profile and add display name
            const userID = userCredential.user.uid;
            return firebase.auths.updateProfile(userCredential.user, { displayName })
                .then<UserType>(() => {
                    return userCredential.user.toJSON() as UserType;
                });
        });
};

export const sendVerificationEmail = () => {
    return firebase.auths.sendEmailVerification(firebase.auth.currentUser as User);
}
