import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: {
    items: [],
  },
  isLoading: false,
  sessionId: null, // Track sessionId to determine if it's a collaborative cart
  userCount: 0,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// Add to Cart Thunk with optional sessionId
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, sessionId, productId, quantity }) => {
    const res = await axios.post(`${API_BASE_URL}/shop/cart/add`, {
      userId,
      sessionId,
      productId,
      quantity,
    });
    return res.data;
  }
);

// Fetch Cart Items Thunk with optional sessionId
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ({ userId, sessionId }) => {
    const endpoint = sessionId
      ? `${API_BASE_URL}/shop/cart/get/session/${sessionId}`
      : `${API_BASE_URL}/shop/cart/get/user/${userId}`;
    const res = await axios.get(endpoint);
    return res.data;
  }
);

// Delete Cart Item Thunk with optional sessionId
export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, sessionId, productId }) => {
    const endpoint = sessionId
      ? `${API_BASE_URL}/shop/cart/session/${sessionId}/${productId}`
      : `${API_BASE_URL}/shop/cart/${userId}/${productId}`;
    const res = await axios.delete(endpoint);
    return res.data;
  }
);

// Update Cart Items Thunk with optional sessionId
export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",
  async ({ userId, sessionId, productId, quantity }) => {
    const res = await axios.put(`${API_BASE_URL}/shop/cart/update-cart`, {
      userId,
      sessionId,
      productId,
      quantity,
    });
    return res.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    // Action to set session ID in state when creating/joining a collaborative session
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    // Clear sessionId when leaving or ending a collaborative session
    clearSessionId: (state) => {
      state.sessionId = null;
      state.cartItems.items = [];
    },
    updateSessionCartItems: (state, action) => {
      state.cartItems.items = action.payload;
    },
    updateUserCount: (state, action) => {
      state.userCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.items = action.payload.data.items;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.items = action.payload.data.items;
      })
      .addCase(updateCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.items = action.payload.data.items;
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSessionId,
  clearSessionId,
  updateSessionCartItems,
  updateUserCount,
} = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
