import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTotal } from "./total-slice";
import { apiCLient } from "@/api/apiClient";
import { deleteTrip } from "./trip-slice";
import CryptoJS from "crypto-js";
import {
  addRecurringNotification,
  createRecurringNotifications,
  setReccuringDataHash,
  updateRecurringNotifications,
} from "./notification-slice";

const initialState = {
  // --- States for FETCHING data ---
  expenseData: null,
  expenseLoading: false,
  expenseError: null,

  recurringData: null,
  recurringLoading: false,
  recurringError: null,

  incomeData: null,
  incomeLoading: false,
  incomeError: null,

  recentTransactions: null,
  recentTransactionsLoading: false,

  // --- States for MUTATION (insert, delete, update) operations ---
  //? insert
  insertExpenseLoading: false,
  insertExpenseError: null,

  insertRecurringLoading: false,
  insertRecurringError: null,

  insertIncomeLoading: false,
  insertIncomeError: null,

  //? delete
  deleteExpenseLoading: false,
  deleteExpenseError: null,

  deleteIncomeLoading: false,
  deleteIncomeError: null,

  //? update
  updateExpenseLoading: false,
  updateExpenseError: null,

  updateRecurringLoading: false,
  updateRecurringError: null,

  updateIncomeLoading: false,
  updateIncomeError: null,
};

/**
 ** ===================== important documentation =====================
 ** every insert and delete will call for below functions
 * @see fetchTotal - will fetch the Total DB
 */


/**
 ** ===================== EXPENSE =====================
 * @see fetchExpense - fetch expense transactions
 * @see insertExpense - inserts expense transaction
 * @see deleteExpense - deletes expesne transaction
 *
 */

export const fetchExpense = createAsyncThunk(
  "transaction/fetchExpense",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get(`/transaction/get-expense`);
      return res.data;
    } catch (err) {
      // 'err.message' is now the clean string from our interceptor.
      return rejectWithValue(err.message);
    }
  },
);

export const insertExpense = createAsyncThunk(
  "transaction/insertExpense",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post(`/transaction/add-expense`, data);

      const rec = res.data;
      if (rec.isRecurringExpense === true) {
        dispatch(fetchRecurringExpense());
      }

      dispatch(fetchTotal());
     

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateExpense = createAsyncThunk(
  "transaction/updateExpense",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post("/transaction/update-expense", data);
      const { update, runDispatch } = res.data;
      if (runDispatch) {
        dispatch(fetchTotal());
      }
      if (update) {
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteExpense = createAsyncThunk(
  "transaction/deleteExpense",
  async ({  expID }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.delete(
        `/transaction/delete-expense/${expID}`,
      );

      dispatch(fetchTotal());
     

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 ** ===================== INCOME =====================
 * @see fetchIncome - fetch income transactions
 * @see insertIncome - inserts income transaction
 * @param {object} data - has the transaction data
 * @see deleteIncome - deletes income transaction
 *
 */

export const fetchIncome = createAsyncThunk(
  "transaction/fetchIncome",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCLient.get(`/transaction/get-income`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const insertIncome = createAsyncThunk(
  "transaction/insertIncome",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post(`/transaction/add-income`, data);

      dispatch(fetchTotal());
    

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
export const updateIncome = createAsyncThunk(
  "transaction/updateIncome",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post("/transaction/update-income", data);
      const { update, runDispatch } = res.data;
      if (runDispatch) {
        dispatch(fetchTotal());
      }
      if (update) {
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteIncome = createAsyncThunk(
  "transaction/deleteIncome",
  async ({incID }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.delete(
        `/transaction/delete-income/${incID}`,
      );

      dispatch(fetchTotal());
     

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 ** ===================== RECURRING EXPENSE =====================
 * @see fetchRecurringExpense - fetch recurring expense transactions
 * @see insertRecurringExpense - insert recurring expense transaction
 *
 */

export const fetchRecurringExpense = createAsyncThunk(
  "transaction/fetchRecurringExpense",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let StoredHash;
      const res = await apiCLient.get(
        `/transaction/get-recurring-expense`,
      );
      const incomingHash = CryptoJS.SHA256(JSON.stringify(res.data)).toString();
      const root = localStorage.getItem("persist:notifications");

      if (root) {
        StoredHash = JSON.parse(JSON.parse(root)?.RecurringDataHash);
      }

      if (!StoredHash || StoredHash !== incomingHash) {
        dispatch(setReccuringDataHash(incomingHash));
        dispatch(createRecurringNotifications(res.data));
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const insertRecurringExpense = createAsyncThunk(
  "transaction/insertRecurringExpense",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post(
        `/transaction/add-recurring-expense`,
        data,
      );
      const { newExpense, newRecurringExpense } = res.data;
      if (newRecurringExpense)
        dispatch(addRecurringNotification(newRecurringExpense));

      if (newExpense) {
        dispatch(fetchTotal());
       
      }
      return res.data; // This will be { newRecurringExpense, newExpense }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
export const updateRecurringExpense = createAsyncThunk(
  "transaction/updateRecurringExpense",
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.post(
        "/transaction/update-recurring-expense",
        data,
      );
      const { update } = res.data;
      if (update) {
        dispatch(updateRecurringNotifications(update));
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteRecurringExpense = createAsyncThunk(
  "transaction/deleteRecurringExpense",
  async ({  recExpID }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiCLient.delete(
        `/transaction/delete-recurring-expense/${recExpID}`,
      );

      dispatch(fetchRecurringExpense());

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Helper function to build the recent transactions list
export const processRecentTransactions = (state) => {
  if (!state.expenseData || !state.incomeData) {
    return;
  }

  const latestExpenses = state.expenseData.slice(0, 10);
  const latestIncomes = state.incomeData.slice(0, 10);

  const combined = [...latestExpenses, ...latestIncomes];
  combined.sort((a, b) => new Date(b.onDate) - new Date(a.onDate));

  state.recentTransactions = combined.slice(0, 10);
  state.recentTransactionsLoading = false;
};

// --- HELPER FUNCTION to update the recent list on insert ---
export const updateRecentTransactions = (state, newTransaction) => {
  if (!state.recentTransactions) {
    return;
  }

  if (state.recentTransactions.length >= 10) {
    const lastItem =
      state.recentTransactions[state.recentTransactions.length - 1];
    if (new Date(newTransaction.onDate) <= new Date(lastItem.onDate)) {
      return;
    }
  }

  const updatedList = [newTransaction, ...state.recentTransactions];
  updatedList.sort((a, b) => new Date(b.onDate) - new Date(a.onDate)); // Use .onDate here too
  state.recentTransactions = updatedList.slice(0, 10);
};

const transaction = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /**
       ** =========================================
       ** Fetch Expense
       ** =========================================
       */
      .addCase(fetchExpense.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.expenseLoading = false;
        state.expenseData = action.payload;
        //----- building recent transaction list -----
        processRecentTransactions(state);
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        state.expenseLoading = false;
        state.expenseError = action.payload;
        state.recentTransactionsLoading = false;
      })
      /**
       ** =========================================
       ** Insert Expense
       ** =========================================
       */
      .addCase(insertExpense.pending, (state) => {
        state.insertExpenseLoading = true;
        state.insertExpenseError = null;
      })
      .addCase(insertExpense.fulfilled, (state, action) => {
        state.insertExpenseLoading = false;
        if (state.expenseData) {
          state.expenseData.unshift(action.payload);
        } else {
          state.expenseData = [action.payload];
        }

        //----- logic to get recent transaction -----
        updateRecentTransactions(state, action.payload);
      })
      .addCase(insertExpense.rejected, (state, action) => {
        state.insertExpenseLoading = false;
        state.insertExpenseError = action.payload;
      })
      /**
       ** =========================================
       ** Update Expense
       ** =========================================
       */
      .addCase(updateExpense.pending, (state) => {
        state.updateExpenseLoading = true;
        state.updateExpenseError = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updateExpenseLoading = false;
        const index = state.expenseData.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (index !== -1) {
          state.expenseData[index] = { ...action.payload };
        }
        const indexforrecent = state.recentTransactions.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (indexforrecent !== -1) {
          state.recentTransactions[indexforrecent] = { ...action.payload };
        }
      })

      .addCase(updateExpense.rejected, (state, action) => {
        state.updateExpenseLoading = false;
        state.updateExpenseError = action.payload;
      })
      /**
       ** =========================================
       ** Delete Expense
       ** =========================================
       */
      .addCase(deleteExpense.pending, (state) => {
        state.deleteExpenseLoading = true;
        state.deleteExpenseError = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteExpenseLoading = false;
        const deletedExp = action.payload;

        // 1. See if the deleted item is in our recent list.
        const isRecent = state.recentTransactions?.find(
          (tx) => tx._id === deletedExp?._id,
        );

        if (state.expenseData && deletedExp?._id) {
          state.expenseData = state.expenseData.filter(
            (expense) => expense._id !== deletedExp._id,
          );
        }
        if (!isRecent) {
          return;
        }
        //----- building recent transaction list -----
        processRecentTransactions(state);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteExpenseLoading = false;
        state.deleteExpenseError = action.payload;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        const { trip } = action.payload;

        if (!trip) return;

        state.expenseData = state.expenseData.filter((e) => {
          const expenseTripId = e.ofTrip || e.ofTrip?._id;
          return expenseTripId !== trip._id;
        });
        processRecentTransactions(state);
      })

      /**
       ** =========================================
       ** Fetch Recurring Expense
       ** =========================================
       */
      .addCase(fetchRecurringExpense.pending, (state) => {
        state.recurringLoading = true;
        state.recurringError = null;
      })
      .addCase(fetchRecurringExpense.fulfilled, (state, action) => {
        state.recurringLoading = false;
        state.recurringData = action.payload;
      })
      .addCase(fetchRecurringExpense.rejected, (state, action) => {
        state.recurringLoading = false;
        state.recurringError = action.payload; // Use payload from rejectWithValue
      })
      /**
       ** =========================================
       ** Insert Recurring Expense
       ** =========================================
       */
      .addCase(insertRecurringExpense.pending, (state) => {
        state.insertRecurringLoading = true;
        state.insertRecurringError = null;
      })
      .addCase(insertRecurringExpense.fulfilled, (state, action) => {
        state.insertRecurringLoading = false;
        const { newRecurringExpense, newExpense } = action.payload;
        if (state.recurringData) {
          state.recurringData.unshift(newRecurringExpense);
        } else {
          state.recurringData = [newRecurringExpense];
        }
        if (newExpense) {
          if (state.expenseData) {
            state.expenseData.unshift(newExpense);
          } else {
            state.expenseData = [newExpense];
          }
          //----- logic to get recent transaction -----
          updateRecentTransactions(state, newExpense);
        }
      })
      .addCase(insertRecurringExpense.rejected, (state, action) => {
        state.insertRecurringLoading = false;
        state.insertRecurringError = action.payload;
      })
      /**
       ** =========================================
       ** Update Recurring Expense
       ** =========================================
       */
      .addCase(updateRecurringExpense.pending, (state) => {
        state.updateRecurringLoading = true;
        state.updateRecurringError = null;
      })
      .addCase(updateRecurringExpense.fulfilled, (state, action) => {
        state.updateRecurringLoading = false;
        const index = state.recurringData.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (index !== -1) {
          state.recurringData[index] = { ...action.payload };
        }
      })
      .addCase(updateRecurringExpense.rejected, (state, action) => {
        state.updateRecurringLoading = false;
        state.updateRecurringError = action.payload;
      })

      /**
       ** =========================================
       ** Fetch Income
       ** =========================================
       */
      .addCase(fetchIncome.pending, (state) => {
        state.incomeLoading = true;
        state.incomeError = null;
      })
      .addCase(fetchIncome.fulfilled, (state, action) => {
        state.incomeLoading = false;
        state.incomeData = action.payload;
        //----- building recent transaction list -----
        processRecentTransactions(state);
      })
      .addCase(fetchIncome.rejected, (state, action) => {
        state.incomeLoading = false;
        state.incomeError = action.payload; // Use payload from rejectWithValue
        state.recentTransactionsLoading = false;
      })
      /**
       ** =========================================
       ** Insert Income
       ** =========================================
       */
      .addCase(insertIncome.pending, (state) => {
        state.insertIncomeLoading = true;
        state.insertIncomeError = null;
      })
      .addCase(insertIncome.fulfilled, (state, action) => {
        state.insertIncomeLoading = false;
        if (state.incomeData) {
          state.incomeData.unshift(action.payload);
        } else {
          state.incomeData = [action.payload];
        }
        //----- logic to get recent transaction -----
        updateRecentTransactions(state, action.payload);
      })
      .addCase(insertIncome.rejected, (state, action) => {
        state.insertIncomeLoading = false;
        state.insertIncomeError = action.payload;
      })
      /**
       ** =========================================
       ** Update Income
       ** =========================================
       */
      .addCase(updateIncome.pending, (state) => {
        state.updateIncomeLoading = true;
        state.updateIncomeError = null;
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.updateIncomeLoading = false;
        const index = state.incomeData.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (index !== -1) {
          state.incomeData[index] = { ...action.payload };
        }
        const indexforrecent = state.recentTransactions.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (indexforrecent !== -1) {
          state.recentTransactions[indexforrecent] = { ...action.payload };
        }
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.updateIncomeLoading = true;
        state.updateIncomeError = action.payload;
      })
      /**
       ** =========================================
       ** Delete Income
       ** =========================================
       */
      .addCase(deleteIncome.pending, (state) => {
        state.deleteIncomeLoading = true;
        state.deleteIncomeError = null;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.deleteIncomeLoading = false;
        const deletedInc = action.payload;

        // 1. See if the deleted item is in our recent list.
        const isRecent = state.recentTransactions?.find(
          (tx) => tx._id === deletedInc?._id,
        );

        if (state.incomeData && deletedInc?._id) {
          state.incomeData = state.incomeData.filter(
            (income) => income._id !== deletedInc._id,
          );
        }
        if (!isRecent) {
          return;
        }
        //----- building recent transaction list -----
        processRecentTransactions(state);
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.deleteIncomeLoading = false;
        state.deleteIncomeError = action.payload;
      });
  },
});

export default transaction.reducer;
