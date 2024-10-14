import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Userauth-slice";
import adminProductsSlice from "./admin/products-slice/index";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
  },
});

export default store;
