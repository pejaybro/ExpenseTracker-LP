// ====================================================================
// ? ++ NEW SECTION: MEMOIZED SELECTORS for Total ++ ✅
// ====================================================================

import { ArrayCheck } from "@/components/utility";
import { createSelector } from "@reduxjs/toolkit";
import {
  selectGlobalFilteredExpense,
  selectGlobalFilteredIncome,
  selectRecurringExpenseList,
} from "./transaction-selector";
import { filterTypes, selectCurrentFilter } from "../slices/filter-slice";
import moment from "moment";
import { expenseCategories, incomeCategories } from "@/global/categories";

//NOTE - calling total redux state
const selectTotalState = (state) => state.total;

//NOTE - checking if state change
export const selectRawTotalData = createSelector([selectTotalState], (total) =>
  ArrayCheck(total.TotalData),
);

//NOTE - Data Sorting by Expense
export const selectExpenseTotal = createSelector(
  [selectRawTotalData],
  (data) => (!data ? [] : data.filter((d) => d.isTypeExpense === true)),
);

//NOTE - Data Sorting by Income
export const selectIncomeTotal = createSelector([selectRawTotalData], (data) =>
  !data ? [] : data.filter((d) => d.isTypeExpense === false),
);

/** ============================================================ */

//? --- Reusable Mapper Functions ---
const mapToYearlyData = (data) =>
  data.map((m) => ({
    year: m.year,
    total: m.total,
    isTypeExpense: m.isTypeExpense,
  }));

const mapToMonthlyData = (data) =>
  data.map((m) => ({
    year: m.year,
    monthList: m.monthList,
    isTypeExpense: m.isTypeExpense,
  }));

const mapToPrimeData = (data) =>
  data.map((m) => ({
    year: m.year,
    primeList: m.primeList,
    isTypeExpense: m.isTypeExpense,
  }));

const mapToSubData = (data) =>
  data.map((m) => ({
    year: m.year,
    subList: m.subList,
    isTypeExpense: m.isTypeExpense,
  }));

/** ============================================================ */

//NOTE - Expense Total by Category

//? ----- Year -----
export const selectExpenseTotal_ByYear = createSelector(
  [selectExpenseTotal],
  mapToYearlyData,
);
//? ----- Month -----
export const selectExpenseTotal_ByMonth = createSelector(
  [selectExpenseTotal],
  mapToMonthlyData,
);
//? ----- Prime Category (year & monthlist) -----
export const selectExpenseTotal_ByPrime = createSelector(
  [selectExpenseTotal],
  mapToPrimeData,
);
//? ----- Sub Category (year & monthlist) -----
export const selectExpenseTotal_BySub = createSelector(
  [selectExpenseTotal],
  mapToSubData,
);

//NOTE - Income Total by Category

//? ----- Year -----
export const selectIncomeTotal_ByYear = createSelector(
  [selectIncomeTotal],
  mapToYearlyData,
);
//? ----- Month -----
export const selectIncomeTotal_ByMonth = createSelector(
  [selectIncomeTotal],
  mapToMonthlyData,
);
//? ----- Prime Category (year & monthlist) -----
export const selectIncomeTotal_ByPrime = createSelector(
  [selectIncomeTotal],
  mapToPrimeData,
);
//? ----- Sub Category (year & monthlist) -----
export const selectIncomeTotal_BySub = createSelector(
  [selectIncomeTotal],
  mapToSubData,
);

/** ============================================================ */

//NOTE - array of years
export const selectYearsList = createSelector([selectRawTotalData], (data) =>
  !data ? [] : [...new Set(data.map((m) => m.year))],
);

/** ============================================================== */
//?  +++++ calculation process based on given filter type +++++
/** ============================================================== */

//NOTE - total of selected year filter
export const TotalOfSelectedYear = createSelector(
  [selectCurrentFilter, selectExpenseTotal_ByYear, selectIncomeTotal_ByYear],
  (filter, expense, income) => {
    const year = Number(filter.values.year);

    const ExpenseOfYear = expense?.find((e) => e.year === year)?.total ?? 0;
    const IncomeOfYear = income?.find((e) => e.year === year)?.total ?? 0;

    return { ExpenseOfYear, IncomeOfYear };
  },
);

//NOTE - total of selected year filter
export const TotalOfSelectedMonth = createSelector(
  [selectCurrentFilter, selectExpenseTotal_ByMonth, selectIncomeTotal_ByMonth],
  (filter, expense, income) => {
    const year = Number(filter.values.year);
    const month = Number(filter.values.month);

    const ExpenseOfMonth =
      expense
        ?.find((e) => e.year === year)
        ?.monthList?.find((e) => e.month === month)?.total ?? 0;
    const IncomeOfMonth =
      income
        ?.find((e) => e.year === year)
        ?.monthList?.find((e) => e.month === month)?.total ?? 0;

    return { ExpenseOfMonth, IncomeOfMonth };
  },
);

//NOTE - total of each months of selected year filter
export const TotalOfMonthOfSelectedYear = createSelector(
  [selectCurrentFilter, selectExpenseTotal_ByMonth, selectIncomeTotal_ByMonth],
  (filter, expense, income) => {
    const year = Number(filter.values.year);
    const ExpenseOfMonthOfYear = createEachMonthArray(expense, year, "e");
    const IncomeOfMonthOfYear = createEachMonthArray(income, year, "i");

    return { ExpenseOfMonthOfYear, IncomeOfMonthOfYear };
  },
);

//? ----- creates total of each month of selected year -----
const createEachMonthArray = (list, year, type = "e") => {
  const data = list?.find((l) => l.year === year)?.monthList ?? [];
  const arr = [];
  for (let j = 0; j < 12; j++) {
    let e = data?.find((m) => m.month === j)?.total ?? 0;
    arr.push({
      year: year,
      month: j,
      amount: e,
    });
  }

  return arr;
};

//NOTE - total of each dates of selected month filter
export const TotalOfDatesOfSelectedMonth = createSelector(
  [
    selectCurrentFilter,
    selectGlobalFilteredExpense,
    selectGlobalFilteredIncome,
  ],
  (filter, expense, income) => {
    const year = Number(filter.values.year);
    const month = Number(filter.values.month);
    if (
      filter.type === filterTypes.BY_MONTH ||
      filter.type === filterTypes.THIS_MONTH
    ) {
      const ExpenseOfMonthDates = getDailyTotalsOfMonth(expense, year, month);
      const IncomeOfMonthDates = getDailyTotalsOfMonth(income, year, month);

      return { ExpenseOfMonthDates, IncomeOfMonthDates };
    } else return { ExpenseOfMonthDates: [], IncomeOfMonthDates: [] };
  },
);

//? ---- HELPER Generate array of transaction of dates by month selected -----
const getDailyTotalsOfMonth = (list, year, month) => {
  // Get the number of days in the selected month
  const targetDate = moment().year(year).month(month);
  const daysInMonth = targetDate.daysInMonth();

  const dailyArr = Array.from({ length: daysInMonth }, (_, i) => ({
    year: year,
    month: month,
    date: targetDate.date(i + 1).format(),
    amount: 0,
  }));

  for (const tx of list) {
    const day = moment(tx.onDate).date(); // e.g., 15
    const index = day - 1; // 0-indexed for our array
    // Add the transaction's amount to the correct day's total
    if (index >= 0 && index < daysInMonth) {
      dailyArr[index].amount += tx.ofAmount;
    }
  }

  return dailyArr;
};

//NOTE - total of last 9/6/3 - months of current year
export const TotalOfLastSelectedMonths = createSelector(
  [
    selectCurrentFilter,
    selectGlobalFilteredExpense,
    selectGlobalFilteredIncome,
  ],
  (filter, expense, income) => {
    let ofMonths;

    if (filter.type === filterTypes.LAST_9_MONTHS) ofMonths = 9;
    else if (filter.type === filterTypes.LAST_6_MONTHS) ofMonths = 6;
    else if (filter.type === filterTypes.LAST_3_MONTHS) ofMonths = 3;
    else return { ExpenseOfLastMonths: [], IncomeOfLastMonths: [] };

    // empty array of objs of each month
    const ExpenseOfLastMonths = Array.from({ length: ofMonths }, (_, i) => {
      const monthDate = moment().subtract(ofMonths - 1 - i, "months");
      return {
        month: monthDate.month(),
        amount: 0,
        year: monthDate.year(),
        label: monthDate.format("MMM"),
      };
    });
    // Create a DEEP COPY for income structure only
    const IncomeOfLastMonths = JSON.parse(JSON.stringify(ExpenseOfLastMonths));

    // caculating the total of dates matching month
    expense.forEach((tx) => {
      const txMonth = moment(tx.onDate).month();
      const targetMonth = ExpenseOfLastMonths.find((i) => i.month === txMonth);
      if (targetMonth) {
        targetMonth.amount += tx.ofAmount;
      }
    });
    income.forEach((tx) => {
      const txMonth = moment(tx.onDate).month();
      const targetMonth = IncomeOfLastMonths.find((i) => i.month === txMonth);
      if (targetMonth) {
        targetMonth.amount += tx.ofAmount;
      }
    });

    return { ExpenseOfLastMonths, IncomeOfLastMonths };
  },
);

//NOTE - total of last 30/15/7 days of current year
export const TotalOfLastSelectedDays = createSelector(
  [
    selectCurrentFilter,
    selectGlobalFilteredExpense,
    selectGlobalFilteredIncome,
  ],
  (filter, expense, income) => {
    let ofDates;

    if (filter.type === filterTypes.LAST_30_DAYS) ofDates = 30;
    else if (filter.type === filterTypes.LAST_15_DAYS) ofDates = 15;
    else if (filter.type === filterTypes.LAST_7_DAYS) ofDates = 7;
    else return { ExpenseOfLastDays: [], IncomeOfLastDays: [] };

    // empty array of objs of each month
    const ExpenseOfLastDays = Array.from({ length: ofDates }, (_, i) => {
      const date = moment().subtract(ofDates - i, "days");
      return {
        date: date.format("DD-MM-YYYY"),
        day: date,
        amount: 0,
      };
    });
    // Create a DEEP COPY for income structure only
    const IncomeOfLastDays = JSON.parse(JSON.stringify(ExpenseOfLastDays));

    // caculating the total of dates matching dates
    expense.forEach((tx) => {
      const txday = moment(tx.onDate);
      const targetDay = ExpenseOfLastDays.find((i) =>
        txday.isSame(i.day, "day"),
      );
      if (targetDay) {
        targetDay.amount += tx.ofAmount;
      }
    });
    income.forEach((tx) => {
      const txday = moment(tx.onDate);
      const targetDay = IncomeOfLastDays.find((i) =>
        txday.isSame(i.day, "day"),
      );
      if (targetDay) {
        targetDay.amount += tx.ofAmount;
      }
    });

    return { ExpenseOfLastDays, IncomeOfLastDays };
  },
);

//NOTE - total of prime category of selected global filter
export const selectedPrimeCategoryTotal = createSelector(
  [
    selectGlobalFilteredExpense,
    selectExpenseTotal_ByPrime,
    selectCurrentFilter,
  ],
  (filteredTransactions, expenseTotalByPrime, currentFilter) => {
    let categoryTotals = {};
    // --- categoryTotals is obj containing {primeCategory : total} ---
    const { type, values } = currentFilter;
    const year = Number(values.year);

    if (type === filterTypes.THIS_YEAR || type === filterTypes.BY_YEAR) {
      // --- getting prime category total of year ---
      const yearData = expenseTotalByPrime.find((item) => item.year === year);
      if (yearData && yearData.primeList.length > 0) {
        categoryTotals = yearData.primeList.reduce((acc, item) => {
          const matchingCategory = expenseCategories.find(
            (cat) => cat.title === item.name,
          );
          if (matchingCategory) {
            acc[matchingCategory.title] = item.total;
          }
          return acc;
        }, {});
      }
    } else {
      // --- getting prime category total of selected global filter ---
      categoryTotals = filteredTransactions.reduce((acc, tx) => {
        const categoryId = tx.primeCategory;
        if (!acc[categoryId]) {
          acc[categoryId] = 0;
        }
        acc[categoryId] += tx.ofAmount;
        return acc;
      }, {});
    }

    // --- FINAL MAPPING making array of obj ---
    const finalData = expenseCategories.map((category) => {
      return {
        primeName: category.title,
        amount: categoryTotals[category.title] || 0,
      };
    });

    return finalData;
  },
);

//NOTE - total of sub category of selected global filter
export const selectSubCategoryTotals = createSelector(
  [
    selectGlobalFilteredExpense,
    selectGlobalFilteredIncome,
    selectExpenseTotal_BySub,
    selectIncomeTotal_BySub,
    selectCurrentFilter,
  ],
  (
    filteredExpenses,
    filteredIncome,
    expenseTotalBySub,
    incomeTotalBySub,
    currentFilter,
  ) => {
    let expenseTotals = {};
    let incomeTotals = {};

    const { type, values } = currentFilter;
    const year = Number(values.year);

    if (type === filterTypes.THIS_YEAR || type === filterTypes.BY_YEAR) {
      // --- getting Expense sub category total of year ---
      const expenseYearData = expenseTotalBySub.find(
        (item) => item.year === year,
      );
      if (expenseYearData && expenseYearData.subList) {
        expenseTotals = expenseYearData.subList.reduce((acc, item) => {
          const matchingSub = allExpenseSubCategories.find(
            (sub) => sub.name === item.subName,
          );
          if (matchingSub) {
            acc[matchingSub.name] = item.total;
          }
          return acc;
        }, {});
      }
      // --- getting income sub category total of year ---
      const incomeYearData = incomeTotalBySub.find(
        (item) => item.year === year,
      );
      if (incomeYearData && incomeYearData.subList) {
        incomeTotals = incomeYearData.subList.reduce((acc, item) => {
          const matchingSub = allIncomeSubCategories.find(
            (sub) => sub.name === item.subName,
          );
          if (matchingSub) {
            acc[matchingSub.name] = item.total;
          }
          return acc;
        }, {});
      }
    } else {
      // --- getting expense sub category total of selected global filter ---
      expenseTotals = filteredExpenses.reduce((acc, tx) => {
        const subCategoryId = tx.subCategory;
        if (!acc[subCategoryId]) {
          acc[subCategoryId] = 0;
        }
        acc[subCategoryId] += tx.ofAmount;
        return acc;
      }, {});
      // --- getting income sub category total of selected global filter ---
      incomeTotals = filteredIncome.reduce((acc, tx) => {
        const subCategoryId = tx.subCategory;
        if (!acc[subCategoryId]) {
          acc[subCategoryId] = 0;
        }
        acc[subCategoryId] += tx.ofAmount;
        return acc;
      }, {});
    }

    // --- FINAL MAPPING (Expenses) ---
    const finalExpenseData = allExpenseSubCategories.map((sub) => {
      return {
        primeName: sub.primeName,
        categoryName: sub.name,
        amount: expenseTotals[sub.name] || 0,
      };
    });

    // --- FINAL MAPPING (Income) ---
    const finalIncomeData = allIncomeSubCategories.map((sub) => {
      return {
        primeName: "Income",
        categoryName: sub.name,
        amount: incomeTotals[sub.name] || 0,
      };
    });

    return { expenses: finalExpenseData, income: finalIncomeData };
  },
);

//? --- HELPER to flatten expense subcategories for mapping ---
const allExpenseSubCategories = expenseCategories.flatMap((prime) =>
  prime.subcategories.map((sub) => ({ ...sub, primeName: prime.title })),
);
//? --- HELPER to get income subcategories ---
const allIncomeSubCategories = incomeCategories[0].subcategories;

//NOTE - Prime Category : filter out 0 amounts, and sort by max to min amount
export const selectSortedPrimeCategoryTotals = createSelector(
  [selectedPrimeCategoryTotal],
  (primeTotals) => {
    return [...primeTotals]
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  },
);

//NOTE - Sub Category : filter out 0 amounts, and sort by max to min amount
export const selectSortedSubCategoryTotals = createSelector(
  [selectSubCategoryTotals],
  (subTotals) => {
    //--- expense ---
    const sortedExpenses = [...subTotals.expenses]
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    //--- income ---
    const sortedIncome = [...subTotals.income]
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return { expenses: sortedExpenses, income: sortedIncome };
  },
);

export const selectRecurringCalculation = createSelector(
  [selectRecurringExpenseList],
  (recurringList) => {
    if (!recurringList.length) return [];

    let GraphData = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      amount: 0,
      year: 0,
    }));

    // total data calculation
    const MonthlyTotal =
      recurringList
        .filter((r) => r.isReccuringBy === 1)
        .reduce((sum, item) => item.ofAmount + sum, 0) || 0;
    const YearlyTotal =
      recurringList
        .filter((r) => r.isReccuringBy === 2)
        .reduce((sum, item) => item.ofAmount + sum, 0) || 0;

    // graph data calculation
    recurringList.forEach((tx) => {
      const txMonth = moment(tx.onDate);
      const targetMonth = GraphData.find((r) => r.month === txMonth.month());
      if (targetMonth) {
        targetMonth.amount += tx.ofAmount;
        targetMonth.year = txMonth.year();
      }
    });

    return { MonthlyTotal, YearlyTotal, GraphData };
  },
);
