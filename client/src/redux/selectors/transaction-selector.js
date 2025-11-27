// ====================================================================
// ? ++ NEW SECTION: MEMOIZED SELECTORS for Transactions ++ ✅
// ====================================================================

import { ArrayCheck } from "@/components/utility";
import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";
import { filterTypes, selectCurrentFilter } from "../slices/filter-slice";

const selectTransactionState = (state) => state.transaction;

const selectRawExpenseData = createSelector(
  [selectTransactionState],
  (transaction) => transaction.expenseData,
);

const selectRawIncomeData = createSelector(
  [selectTransactionState],
  (transaction) => transaction.incomeData,
);

const selectRawRecurringExpenseData = createSelector(
  [selectTransactionState],
  (transaction) => transaction.recurringData,
);

const selectRawRecentTransactions = createSelector(
  [selectTransactionState],
  (transaction) => transaction.recentTransactions,
);

/**
 ** Memoized selectors that return the processed, ready-to-use lists
 * =====================================================================
 * @see ArrayCheck - ensure it returns [] if null
 ** so that.... If state variable is [] (an empty array), [].map() is perfectly safe to run without giving error.
 */

export const selectExpenseList = createSelector(
  [selectRawExpenseData],
  (expenseData) => ArrayCheck(expenseData) || [],
);

export const selectIncomeList = createSelector(
  [selectRawIncomeData],
  (incomeData) => ArrayCheck(incomeData) || [],
);

export const selectRecurringExpenseList = createSelector(
  [selectRawRecurringExpenseData],
  (recurringData) => ArrayCheck(recurringData) || [],
);
export const selectTripExpenseList = createSelector(
  [selectExpenseList],
  (expenseData) => expenseData.filter((e) => e.isTripExpense === true),
);

export const selectGroupedTripExpense = createSelector(
  [selectTripExpenseList],
  (tripExpenses) => {
    if (!tripExpenses.length) return [];
    const groupedMap = tripExpenses.reduce((acc, expense) => {
      const tripId = expense.ofTrip._id;
      if (!acc[tripId]) {
        acc[tripId] = { tripID: tripId, expenses: [] };
      }
      acc[tripId].expenses.push(expense);
      return acc;
    }, {});
    return Object.values(groupedMap);
  },
);

export const selectRecentTransactionsList = createSelector(
  [selectRawRecentTransactions],
  (recentData) => ArrayCheck(recentData) || [],
);

//NOTE - filteted expense list on selected global filter
export const selectGlobalFilteredExpense = createSelector(
  [selectExpenseList, selectCurrentFilter],
  (expenses, filter) => filterTransaction_byGlobal(expenses, filter),
);

//NOTE - filteted income list on selected global filter
export const selectGlobalFilteredIncome = createSelector(
  [selectIncomeList, selectCurrentFilter],
  (income, filter) => filterTransaction_byGlobal(income, filter),
);

//? --- HELPER filtering transaction list based on given global filter
const filterTransaction_byGlobal = (list, filter) => {
  if (!list.length) return [];
  const { type, values } = filter;
  const year = Number(values.year);
  const month = Number(values.month);
  const today = moment();

  switch (type) {
    // --- FILTER BY DAYS ---
    case filterTypes.LAST_7_DAYS:
      const last7 = moment().subtract(7, "days").startOf("day");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last7, today, null, "[]"),
      );
    case filterTypes.LAST_15_DAYS:
      const last15 = moment().subtract(15, "days").startOf("day");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last15, today, null, "[]"),
      );
    case filterTypes.LAST_30_DAYS:
      const last30 = moment().subtract(30, "days").startOf("day");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last30, today, null, "[]"),
      );

    // --- FILTER BY MONTHS ---
    case filterTypes.LAST_3_MONTHS:
      const last3 = moment().subtract(3, "months").startOf("month");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last3, today, null, "[]"),
      );
    case filterTypes.LAST_6_MONTHS:
      const last6 = moment().subtract(6, "months").startOf("month");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last6, today, null, "[]"),
      );
    case filterTypes.LAST_9_MONTHS:
      const last9 = moment().subtract(9, "months").startOf("month");
      return list.filter((tx) =>
        moment(tx.onDate).isBetween(last9, today, null, "[]"),
      );

    // --- FILTER BY SPECIFIC MONTH ---
    case filterTypes.BY_MONTH:
      const dateByMonth = moment().year(year).month(month);
      return list.filter((tx) =>
        moment(tx.onDate).isSame(dateByMonth, "month"),
      );
    case filterTypes.THIS_MONTH:
      return list.filter((tx) => moment(tx.onDate).isSame(today, "month"));

    // --- FILTER BY SPECIFIC YEAR ---
    case filterTypes.BY_YEAR:
      const dateByYear = moment().year(year);
      return list.filter((tx) => moment(tx.onDate).isSame(dateByYear, "year"));
    case filterTypes.THIS_YEAR:
      return list.filter((tx) => moment(tx.onDate).isSame(today, "year"));
    default:
      return list;
  }
};
