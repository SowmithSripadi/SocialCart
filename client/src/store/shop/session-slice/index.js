import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to handle session creation
export const createSession = createAsyncThunk(
  "collaborativeSession/createSession",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/session/create",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const collaborativeSessionSlice = createSlice({
  name: "collaborativeSession",
  initialState: {
    sessionId: null,
    sessionLink: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSession: (state) => {
      state.sessionId = null;
      state.sessionLink = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.sessionLink = action.payload.sessionLink;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSession } = collaborativeSessionSlice.actions;
export default collaborativeSessionSlice.reducer;
