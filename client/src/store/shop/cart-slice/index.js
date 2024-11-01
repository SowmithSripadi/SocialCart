import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const res = await axios.post("http://localhost:8000/api/shop/cart/add", {
      userId,
      productId,
      quantity,
    });
    return res.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const res = await axios.post(
      `http://localhost:8000/api/shop/cart/get/${userId}`
    );
    return res.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }) => {
    const res = await axios.post(
      `http://localhost:8000/api/shop/cart/${userId}/${productId}`
    );
    return res.data;
  }
);

export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",
  async ({ userId, productId, quantity }) => {
    const res = await axios.put(
      "http://localhost:8000/api/shop/cart/update-cart",
      {
        userId,
        productId,
        quantity,
      }
    );
    return res.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        (state.isLoading = false), (cartItems = action.payload.data);
      })
      .addCase(addToCart.rejected, (state) => {
        (isLoading = false), (cartItems = []);
      })
      .addCase(updateCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        (state.isLoading = false), (cartItems = action.payload.data);
      })
      .addCase(updateCartItems.rejected, (state) => {
        (isLoading = false), (cartItems = []);
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        (state.isLoading = false), (cartItems = action.payload.data);
      })
      .addCase(deleteCartItems.rejected, (state) => {
        (isLoading = false), (cartItems = []);
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        (state.isLoading = false), (cartItems = action.payload.data);
      })
      .addCase(fetchCartItems.rejected, (state) => {
        (isLoading = false), (cartItems = []);
      });
  },
});

export default shoppingCartSlice;
