import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const createOrder = createAsyncThunk(
  "orders/create",
  async ({ userId, sessionId, address }) => {
    const res = await axios.post(`${API_BASE_URL}/shop/orders/create`, {
      userId,
      sessionId,
      address,
    });
    return res.data;
  }
);

export const listOrders = createAsyncThunk("orders/list", async ({ userId }) => {
  const res = await axios.get(`${API_BASE_URL}/shop/orders/list`, { params: { userId } });
  return res.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { isLoading: false, items: [], lastOrder: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastOrder = action.payload.data;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.items = action.payload.data || [];
      });
  },
});

export default ordersSlice.reducer;


