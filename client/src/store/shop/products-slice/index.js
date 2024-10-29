import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:8000/api/shop/products/get?${query}`
    );
    return result?.data;
  }
);

export const fetchProdutDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:8000/api/shop/products/get/${id}`
    );
    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
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

export default shoppingProductSlice.reducer;
