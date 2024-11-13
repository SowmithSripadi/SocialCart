import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to handle session creation
export const createSession = createAsyncThunk(
  "collaborativeSession/createSession",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/session/create",
        userId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Similar adjustments for joinSession and fetchSession

export const joinSession = createAsyncThunk(
  "collaborativeSession/joinSession",
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/session/join/${sessionId}`,
        { guestUserId: userId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSession = createAsyncThunk(
  "collaborativeSession/fetchSession",
  async ({ userId }) => {
    const response = await axios.get("http://localhost:8000/api/session/get", {
      params: { userId },
    });
    return response.data;
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
        state.error = action.payload || "Failed to create session.";
      })

      .addCase(joinSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionDetails.session_id;
      })
      .addCase(joinSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.sessionId = action.payload.data.session_id;
          state.sessionLink = action.payload.data.session_link;
        } else {
          // No active session found
          state.sessionId = null;
          state.sessionLink = null;
        }
      })

      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSession } = collaborativeSessionSlice.actions;
export default collaborativeSessionSlice.reducer;
