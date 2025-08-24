import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/orders/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/orders/get`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/orders/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/admin/orders/get/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/orders/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${API_BASE_URL}/admin/orders/update/${id}`,
      { orderStatus },
      { withCredentials: true }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;


