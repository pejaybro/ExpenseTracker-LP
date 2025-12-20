import { apiCLient } from "@/api/apiClient";
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { ArrayCheck } from "@/components/utility";
import { CurrentYear } from "@/utilities/calander-utility";
import { createBudgetNotification } from "./notification-slice";

const initialState = {
  BudgetData: null,
  BudgetLoading: false,
  BudgetError: null,

  BudgetInsertLoading: false,
  BudgetInsertError: null,
};

export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      // It makes one simple API call to your new smart endpoint.
      const res = await apiCLient.post(`/budget/delete-budget`, data);
      dispatch(fetchBudget());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// The NEW thunk for creating/updating a budget
export const setBudget = createAsyncThunk(
  "budget/setBudget",
  async ({ data }, { rejectWithValue }) => {
    try {
      // It makes one simple API call to your new smart endpoint.
      const res = await apiCLient.post(`/budget/set-budget`, data);

      // It returns the full, updated budget data from the server.
      // NO need to dispatch fetchBudget().
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const userID = 123456;
// The CORRECTED thunk for fetching
export const fetchBudget = createAsyncThunk(
  "budget/fetchBudget",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get(`/budget/get-data/${userID}`);
      const notify = res?.meta?.isNewYearCreated;
      if (notify) {
        createBudgetNotification(notify);
      }

      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const budget = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //Budget Fetch
      .addCase(fetchBudget.pending, (state) => {
        state.BudgetLoading = true;
        state.BudgetError = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.BudgetLoading = false;
        state.BudgetData = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.BudgetLoading = false;
        state.BudgetError = action.payload;
      })

      // Budget Insert
      .addCase(setBudget.pending, (state) => {
        state.BudgetInsertLoading = true;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.BudgetInsertLoading = false;
        // action.payload is the full, updated budget data.
        // Simply replace the old state with the new state from the server.
        state.BudgetData = action.payload;
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.BudgetInsertLoading = false;
        state.BudgetInsertError = action.payload;
      });
  },
});

export default budget.reducer;
