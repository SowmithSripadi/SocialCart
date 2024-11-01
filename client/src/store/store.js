import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Userauth-slice";
import adminProductsSlice from "./admin/products-slice/index";
import shoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
  },
});

export default store;
