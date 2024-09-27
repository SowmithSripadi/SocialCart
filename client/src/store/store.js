import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Userauth-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
