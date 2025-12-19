// ====================================================================
// ? ++ NEW SECTION: MEMOIZED SELECTORS for Budget ++ ✅
// ====================================================================

import { ArrayCheck } from "@/components/utility";
import { createSelector } from "@reduxjs/toolkit";
import { selectCurrentFilter } from "../slices/filter-slice";
import { TotalOfMonthOfSelectedYear } from "./total-selector";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";

const selectBudgetState = (state) => state.budget;

  export const selectBudgetData = createSelector([selectBudgetState], (budget) =>
    ArrayCheck(budget.BudgetData),
  );

export const selectBudgetList = createSelector(
  [selectBudgetData, selectCurrentFilter],
  (budget, filter) => {
    if (!budget.length) return [];
    const FilterYear = Number(filter.values.year);
    const finalList = getBudgetListOfYear(budget, FilterYear);
    return finalList;
  },
);

export const selectBudgetByMonth = createSelector(
  [selectBudgetList],
  (list) => {
    const finalList = createBudgetArray(list);
    return finalList;
  },
);

const getBudgetListOfYear = (data, year) => {
  const budgetList = data?.find((b) => b.year === year)?.budgetList;
  if (!budgetList) return [];

  const finalList = budgetList.map((b) => ({
    year: year,
    createdAt: b.createdAt,
    month: b.month,
    amount: b.budget,
  }));

  return finalList;
};

const createBudgetArray = (list = []) => {
  if (!list.length)
    return [
      {
        year: CurrentYear(),
        amount: 0,
        month: CurrentMonth(),
        created: null,
      },
    ];
  const year = list[0].year;
  const arr = [];
  let amount = 0;
  let created = null;
  for (let i = 0; i < 12; i++) {
    const matched = list.find((l) => l.month === i);
    if (matched) {
      amount = matched.amount;
      created = matched.createdAt;
    }
    arr.push({
      year: year,
      amount: amount,
      month: i,
      created: created,
    });
  }

  return arr;
};

export const BudgetExpenseComboOfSelectedYear = createSelector(
  [TotalOfMonthOfSelectedYear, selectBudgetByMonth],
  (expense, budget) => {
    if (!budget.length) return [];

    const arr = [];

    for (let i = 0; i < 12; i++) {
      let b = budget?.find((b) => b.month === i)?.amount;
      let e = expense?.ExpenseOfMonthOfYear?.find((e) => e.month === i)?.amount;
      arr.push({
        month: i,
        budget: b,
        expense: e,
        percent: e == 0 || b == 0 ? 0 : getBudgetExpPercent(b, e),
      });
    }
    return arr;
  },
);

const getBudgetExpPercent = (b, e) => {
  if (b === 0) return 0;
  const diff = e - b;
  const percent = (diff / b) * 100;
  return percent;
};
