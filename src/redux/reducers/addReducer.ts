import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions";

export type AppStatusType = "ready" | "initializing";
export type AppStateType = {
    appStatus: AppStatusType;
};

const appState: AppStateType = {
    appStatus: "initializing",
};

const appReducer = createReducer<AppStateType>(appState, (builder) => {
    builder.addCase(actions.app.changeStatus, (state: AppStateType, action) => {
        return {
            ...state,
            appStatus: action.payload
        }
    });
});

export default appReducer;