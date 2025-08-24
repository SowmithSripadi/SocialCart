import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Userauth-slice";
import adminProductsSlice from "./admin/products-slice/index";
import adminOrderSlice from "./admin/order-slice/index";
import shoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";
import collaborativeSessionSlice from "./shop/session-slice";
import shopOrderSlice from "./shop/order-slice";
import shopAddressSlice from "./shop/address-slice";
import shopReviewSlice from "./shop/review-slice";
import shopSearchSlice from "./shop/search-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    collabSlice: collaborativeSessionSlice,
    shopOrder: shopOrderSlice,
    shopAddress: shopAddressSlice,
    shopReview: shopReviewSlice,
    shopSearch: shopSearchSlice,
    commonFeature: commonFeatureSlice,
  },
});

export default store;
