import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Userauth-slice";
import adminProductsSlice from "./admin/products-slice/index";
import shoppingProductSlice from "./shop/products-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductSlice,
  },
});

export default store;
