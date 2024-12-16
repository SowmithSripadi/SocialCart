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
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `${API_BASE_URL}/shop/products/get?${query}`
    );
    return result?.data;
  }
);

export const fetchProdutDetails = createAsyncThunk(
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
      .addCase(fetchProdutDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProdutDetails.fulfilled, (state, action) => {
        (state.isLoading = false), (state.productDetails = action.payload.data);
      })
      .addCase(fetchProdutDetails.rejected, (state, action) => {
        (state.isLoading = false), (state.productDetails = null);
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
