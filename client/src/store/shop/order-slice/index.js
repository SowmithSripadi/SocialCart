import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/orders/createNewOrder",
  async (orderData) => {
    const response = await axios.post(`${API_BASE_URL}/shop/orders/create`, orderData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/orders/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      `${API_BASE_URL}/shop/orders/capture`,
      { paymentId, payerId, orderId },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/orders/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/shop/orders/list/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/orders/getOrderDetails",
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/shop/orders/details/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;


