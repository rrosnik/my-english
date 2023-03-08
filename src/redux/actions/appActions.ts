import { createAction } from "@reduxjs/toolkit";
import { AppStatusType } from "../reducers/addReducer";

export const changeStatus = createAction<AppStatusType>('app.status');