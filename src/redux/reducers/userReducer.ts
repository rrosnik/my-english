import { createReducer } from '@reduxjs/toolkit';
import actions from '../actions';

export type UserType = {
  uid: string;
  displayName?: string;
  email: string;
  emailVerified: boolean;
  createdAt: string; // time: "1677977095634"
  isAnonymous: boolean;
  lastLoginAt: string; // time: "1677999334744"
  phoneNumber?: string;
  photoURL?: string;
  stsTokenManager: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number; //1678002931475
  };
  tenantId?: string;
};

export type UserStateType = {
  currentUser: UserType | null;
};

const initialState: UserStateType = {
  currentUser: null,
};

const userReducer = createReducer<UserStateType>(initialState, (builder) => {
  builder.addCase(actions.userActions.setCurrentUser, (state, action) => {
    return {
      ...state,
      currentUser: action.payload,
    };
  });
});

export default userReducer;
