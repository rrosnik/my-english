import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";

export type UserType = {
    localId: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    passwordUpdatedAt: number,
    providerUserInfo: Array<{
        providerId: "password";
        federatedId: string; // email
        email: string; // email
        rawId: string; // email
    }>;
    validSince: string; // timestamp: "1677989515",
    lastLoginAt: string; // timestamp: "1677989515424",
    createdAt: string;
    lastRefreshAt: string; // datetime: "2023-03-05T04:11:55.424Z"
}


export type UserStateType = {
    currentUser: UserType | null;
}

const initialState: UserStateType = {
    currentUser: null,
}

const userReducer = createReducer<UserStateType>(initialState, builder => {
    builder.addCase(actions.userActions.setCurrentUser, (state, action) => {
        return {
            ...state,
            currentUser: action.payload
        }
    });
});


export default userReducer;