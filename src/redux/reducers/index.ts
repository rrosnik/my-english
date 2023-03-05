import { ReducerWithInitialState } from "@reduxjs/toolkit/dist/createReducer";
import appReducer, { AppStateType } from "./addReducer";
import userReducer, { UserStateType } from "./userReducer";

const reducers = {
    app: appReducer,
    user: userReducer,
}

export default reducers;