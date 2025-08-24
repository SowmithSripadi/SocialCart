import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }) => {
    const params = new URLSearchParams();
    if (filterParams && typeof filterParams === "object") {
      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length) params.set(key, value.join(","));
        } else if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
    }
    params.set("sortBy", sortParams || "price-lowtohigh");

    const result = await axios.get(`${API_BASE_URL}/shop/products/get?${params.toString()}`);
    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(`${API_BASE_URL}/shop/products/get/${id}`);
    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        (state.isLoading = false), (state.productList = action.payload.data);
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        (state.isLoading = false), (state.productList = []);
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        (state.isLoading = false), (state.productDetails = action.payload.data);
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        (state.isLoading = false), (state.productDetails = null);
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
