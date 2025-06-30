import { createAction } from '@reduxjs/toolkit';
import { UserType } from '../reducers/userReducer';

export const setCurrentUser = createAction<UserType | null>('user.currentuser');
