import { apiCLient } from "@/api/apiClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  TotalData: null,
  TotalLoading: false,
  TotalError: null,
};



export const fetchTotal = createAsyncThunk(
  "total/fetchTotal",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get(`/total/get-total`);
      return res.data;
    } catch (err) {
      // 'err.message' is now the clean string from our interceptor.
      return rejectWithValue(err.message);
    }
  },
);

const total = createSlice({
  name: "total",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotal.pending, (state) => {
        state.TotalLoading = true;
        state.TotalError = null;
      })
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.TotalLoading = false;
        state.TotalData = action.payload;
      })
      .addCase(fetchTotal.rejected, (state, action) => {
        state.TotalLoading = false;
        state.TotalError = action.payload;
      });
  },
});

export default total.reducer;
