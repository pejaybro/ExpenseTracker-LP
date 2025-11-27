import { apiCLient } from "@/api/apiClient";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { ArrayCheck } from "@/components/utility";
import { filterTypes, selectCurrentFilter } from "./filter-slice";
import moment from "moment";
import { deleteExpense, insertExpense } from "./transaction-slice";

const initialState = {
  TripData: null,
  TripLoading: false,
  TripError: null,
  CreateTripLoading: false,
  CreateTripError: null,

  tripExpenseData: null,
  tripExpenseLoading: false,
  tripExpenseError: null,
};

const userID = 123456;
// Fetch trips
export const fetchTrips = createAsyncThunk(
  "trip/fetchTrips",
  async (_, { rejectWithValue }) => {
    // <-- userID must be passed in
    try {
      const res = await apiCLient.get(`/trip/get-trip/${userID}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Add a new trip
export const insertTrip = createAsyncThunk(
  "trip/insertTrip",
  async ({ data }, { rejectWithValue }) => {
    try {
      // Your server's /add-trip endpoint must return the newly created trip object
      const res = await apiCLient.post(`/trip/add-trip`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTripExpense = createAsyncThunk(
  "trip/fetchTripExpense",
  async () => {
    try {
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const trip = createSlice({
  name: "trip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.TripLoading = true;
        state.TripError = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.TripLoading = false;
        state.TripData = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.TripLoading = false;
        state.TripError = action.payload;
      })

      // Insert trip
      .addCase(insertTrip.pending, (state) => {
        state.CreateTripLoading = true;
      })
      .addCase(insertTrip.fulfilled, (state, action) => {
        state.CreateTripLoading = false;
        // action.payload is the new trip object from the server.
        // Add it to the beginning of the TripData array.
        if (state.TripData) {
          state.TripData.unshift(action.payload);
        } else {
          state.TripData = [action.payload];
        }
      })
      .addCase(insertTrip.rejected, (state, action) => {
        state.CreateTripLoading = false;
        state.CreateTripError = action.payload;
      })
      .addCase(insertExpense.fulfilled, (state, action) => {
        const expense = action.payload;
        if (!expense.isTripExpense) return;

        const tripId = expense.ofTrip._id ?? expense.ofTrip ?? null;
        if (!tripId) return;

        const trip = state.TripData.find(
          (t) => String(t._id) === String(tripId),
        );
        if (!trip) return;

        trip.tripTotal = (trip.tripTotal || 0) + (expense.ofAmount || 0);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const expense = action.payload;
        if (!expense.isTripExpense) return;
        const tripId = expense.ofTrip._id ?? expense.ofTrip ?? null;
        if (!tripId) return;
        const trip = state.TripData.find(
          (t) => String(t._id) === String(tripId),
        );
        if (!trip) return;

        trip.tripTotal = Math.max(0, trip.tripTotal - expense.ofAmount);
      });
  },
});

export default trip.reducer;

// ====================================================================
// ? ++ MEMOIZED SELECTORS for Trips ++
// ====================================================================

const selectTripState = (state) => state.trip;

export const selectRawTripData = createSelector(
  [selectTripState],
  (trip) => trip.TripData,
);

// This selector replaces your useMemo block
export const selectTripList = createSelector(
  [selectRawTripData, selectCurrentFilter],
  (rawTripData, filter) => {
    const allTrips = ArrayCheck(rawTripData);
    if (allTrips.length === 0) return [];

    const { type, values } = filter;
    const today = moment();

    // --- ADDED as requested ---
    // Use ?? to safely get year/month, defaulting to current
    const year = Number(values.year);
    const month = Number(values.month);
    // --- END ADD ---

    let filterStartDate, filterEndDate;

    // 1. Define the date range for the filter
    switch (type) {
      case filterTypes.LAST_7_DAYS:
        filterStartDate = moment(today).subtract(7, "days").startOf("day");
        filterEndDate = moment(today).endOf("day");
        break;
      case filterTypes.LAST_15_DAYS:
        filterStartDate = moment(today).subtract(15, "days").startOf("day");
        filterEndDate = moment(today).endOf("day");
        break;
      case filterTypes.LAST_30_DAYS:
        filterStartDate = moment(today).subtract(30, "days").startOf("day");
        filterEndDate = moment(today).endOf("day");
        break;
      case filterTypes.LAST_3_MONTHS:
        filterStartDate = moment(today).subtract(3, "months").startOf("day");
        filterEndDate = moment(today).endOf("month");
        break;
      case filterTypes.LAST_6_MONTHS:
        filterStartDate = moment(today).subtract(6, "months").startOf("day");
        filterEndDate = moment(today).endOf("month");
        break;
      case filterTypes.LAST_9_MONTHS:
        filterStartDate = moment(today).subtract(9, "months").startOf("day");
        filterEndDate = moment(today).endOf("month");
        break;
      case filterTypes.THIS_MONTH:
        filterStartDate = moment(today).startOf("month");
        filterEndDate = moment(today).endOf("month");
        break;
      case filterTypes.BY_MONTH:
        filterStartDate = moment().year(year).month(month).startOf("month"); // Use year/month variables
        filterEndDate = moment().year(year).month(month).endOf("month"); // Use year/month variables
        break;
      case filterTypes.THIS_YEAR:
        filterStartDate = moment(today).startOf("year");
        filterEndDate = moment(today).endOf("year");
        break;
      case filterTypes.BY_YEAR:
        filterStartDate = moment().year(year).startOf("year"); // Use year variable
        filterEndDate = moment().year(year).endOf("year"); // Use year variable
        break;
      // case filterTypes.ALL_TIME:
      // case filterTypes.CUSTOM_DATES:
      //   // ... add logic for these if you have them
      default:
        return allTrips; // No filter, return everything
    }

    // 2. Filter the trips based on the date range
    // A trip is included if it overlaps *at all* with the filter range.
    return allTrips.filter((trip) => {
      const tripStart = moment(trip.startOn);
      const tripEnd = moment(trip.endsOn);

      // The standard overlap check:
      // Trip starts before filter ends AND Trip ends after filter starts
      const overlaps =
        tripStart.isSameOrBefore(filterEndDate, "day") &&
        tripEnd.isSameOrAfter(filterStartDate, "day");

      return overlaps;
    });
  },
);

const calculateTripSummary = (tripList) => {
  // --- Initialize all summary variables with let ---
  let totalTrips = 0;
  let totalSpent = 0;
  let totalDaysTraveled = 0;
  let mostExpensiveTrip = null;
  let cheapestTrip = null;

  // 1. Handle the empty state (handles null, undefined, or empty array)
  if (!tripList || tripList.length === 0) {
    return {
      totalTrips,
      totalSpent,
      totalDaysTraveled,
      mostExpensiveTrip,
      cheapestTrip,
    };
  }

  // 2. Calculate totals
  totalTrips = tripList.length;

  totalSpent = tripList.reduce((sum, trip) => {
    // Use trip.tripTotal or trip.expensedAmount (assuming tripTotal here)
    return sum + (trip.tripTotal || 0);
  }, 0);

  totalDaysTraveled = tripList.reduce((sum, trip) => {
    const tripStart = moment(trip.startOn);
    const tripEnd = moment(trip.endsOn);
    // diff() calculates duration. Add 1 to be inclusive (e.g., Nov 4 to Nov 5 is 2 days)
    const duration = tripEnd.diff(tripStart, "days") + 1;
    return sum + duration;
  }, 0);

  // 3. Find Most and Cheapest Trips
  // Only run this logic if money was actually spent.
  if (totalSpent > 0) {
    // Filter out trips with no cost to find a valid starting point
    const validTrips = tripList.filter((t) => (t.tripTotal || 0) > 0);

    if (validTrips.length > 0) {
      // Start with the first valid trip
      mostExpensiveTrip = validTrips[0];
      cheapestTrip = validTrips[0];

      // Find the most/cheapest among the valid trips
      validTrips.forEach((trip) => {
        if (trip.tripTotal > mostExpensiveTrip.tripTotal) {
          mostExpensiveTrip = trip;
        }
        if (trip.tripTotal < cheapestTrip.tripTotal) {
          cheapestTrip = trip;
        }
      });
    }
  }
  // If totalSpent is 0, mostExpensiveTrip and cheapestTrip will remain null.

  // 4. Return the final summary object
  return {
    totalTrips,
    totalSpent,
    totalDaysTraveled,
    mostExpensiveTrip, // This is the full trip object
    cheapestTrip, // This is the full trip object
  };
};

/**
 * --- UPDATED SELECTOR ---
 * Calculates summary statistics for the *filtered* list of trips.
 */
export const selectTripSummary = createSelector(
  [selectTripList], // Uses the filtered list
  calculateTripSummary, // Calls the reusable helper
);

/**
 * --- NEW SELECTOR ---
 * Calculates summary statistics for *all* trips, ignoring the filter.
 */
export const selectAllTripsSummary = createSelector(
  [selectRawTripData], // Uses the raw, unfiltered data
  calculateTripSummary, // Calls the reusable helper
);
