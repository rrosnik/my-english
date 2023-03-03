import { configureStore } from "@reduxjs/toolkit";

import * as reducers from "./reducers";

const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== "production",

})




export default store;