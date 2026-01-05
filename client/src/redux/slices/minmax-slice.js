import { apiCLient } from "@/api/apiClient";
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { ArrayCheck } from "@/components/utility";

const initialState = {
  MinMaxData: null,
  MinMaxLoading: false,
  MinMaxError: null,
};



export const fetchMM = createAsyncThunk(
  "budget/fetchMM",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get(`/minmax/get-data`);
      return res.data;
    } catch (err) {
      // 'err.message' is now the clean string from our interceptor.
      return rejectWithValue(err.message);
    }
  },
);

const MinMax = createSlice({
  name: "MM",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMM.pending, (state) => {
        state.MinMaxLoading = true;
        state.MinMaxError = null;
      })
      .addCase(fetchMM.fulfilled, (state, action) => {
        state.MinMaxLoading = false;
        state.MinMaxData = action.payload;
      })
      .addCase(fetchMM.rejected, (state, action) => {
        state.MinMaxLoading = false;
        state.MinMaxError = action.payload;
      });
  },
});

export default MinMax.reducer;

// ====================================================================
// ? ++ NEW SECTION: MEMOIZED SELECTORS for MinMax ++
// ====================================================================

const selectMinMaxState = (state) => state.MM;

export const selectMinMaxData = createSelector([selectMinMaxState], (MM) =>
  ArrayCheck(MM.MinMaxData),
);

export const selectMMofMonth = createSelector([selectMinMaxData], (minmax) =>
  !minmax
    ? []
    : minmax.map((mm) => ({
        year: mm.year,
        min: mm.minMonth,
        max: mm.maxMonth,
      })),
);

export const selectMMofPrime = createSelector([selectMinMaxData], (minmax) =>
  !minmax
    ? []
    : minmax.map((mm) => ({
        year: mm.year,
        min: mm.minPrime,
        max: mm.maxPrime,
        isTypeExpense: mm.isTypeExpense,
      })),
);

export const selectMMofSub = createSelector([selectMinMaxData], (minmax) =>
  !minmax
    ? []
    : minmax.map((mm) => ({
        year: mm.year,
        min: mm.minSub,
        max: mm.maxSub,
      })),
);
