import {
  expenseCategories,
  getPrimeCategories,
  getSubOfPrime,
  getSubOfPrime_Exp,
  getSubOfPrime_Inc,
  incomeCategories,
} from "@/global/categories";
import {
  selectExpenseList,
  selectGlobalFilteredExpense,
  selectGlobalFilteredIncome,
  selectGroupedTripExpense,
  selectIncomeList,
  selectRecentTransactionsList,
  selectTripExpenseList,
} from "@/redux/selectors/transaction-selector";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const useTransactionConfig = ({ isExpense = false } = {}) => {
  const {
    expenseLoading,
    expenseError,
    incomeLoading,
    incomeError,
    recentTransactionsLoading,
  } = useSelector((state) => state.transaction);
  const ExpenseList = useSelector(selectExpenseList);
  const IncomeList = useSelector(selectIncomeList);
  const RecentTransactionList = useSelector(selectRecentTransactionsList);
  const FilteredExpenseList = useSelector(selectGlobalFilteredExpense);
  const FilteredIncomeList = useSelector(selectGlobalFilteredIncome);
  const TripExpensesList = useSelector(selectTripExpenseList);
  const GroupedTripExpenses = useSelector(selectGroupedTripExpense);
 

  //? --- filter for transactions ---
  const TransactionFilters = (isExpense && {
    DEFAULT: "Default",
    IS_TRIP: "Trip Transactions",
    IS_RECURRING: "Recurring Transactions",
    BY_PRIME: "Prime Category",
    BY_SUB: "Sub Category",
  }) || {
    DEFAULT: "Default",
    BY_INCOME_CATEGORY: "By Category",
  };

  //? --- sorting for transactions ---
  const TransactionSorts = {
    BY_DATE: "By Date",
    BY_AMOUNT: "By Amount",
  };
  //? --- Expense Prime Categories ---
  const expensePrimes = getPrimeCategories(expenseCategories);

  //NOTE - states for filter and sort
  const [listFilter, setListFilter] = useState(TransactionFilters.DEFAULT);
  const [prime, setPrime] = useState(isExpense ? expensePrimes[0] : "Income");
  const [availableSubs, setAvailableSubs] = useState(() =>
    isExpense ? getSubOfPrime_Exp(prime) : getSubOfPrime_Inc(),
  );
  const [sub, setSub] = useState(availableSubs[0]);
  const [sortList, setSortList] = useState(TransactionSorts.BY_DATE);
  const [sortOrder, setSortOrder] = useState(1);

  //NOTE - handlers for filter and sort
  const handleListFilter = (value) => setListFilter(value);
  const handlePrimeFilter = (p) => setPrime(p);
  const handleSubFilter = (s) => setSub(s);
  const handleListSort = (sort) => setSortList(sort);
  const handleOrder = () => setSortOrder((d) => (d === 1 ? 2 : 1));
  const handleReset = () => {
    setListFilter(TransactionFilters.DEFAULT);
    setPrime(isExpense ? expensePrimes[0] : "Income");
    setSortList(TransactionSorts.BY_DATE);
    setSortOrder(1);
  };

  //? --- update sub list on selecting prime --
  useEffect(() => {
    const newSubList = isExpense
      ? getSubOfPrime_Exp(prime)
      : getSubOfPrime_Inc();
    setAvailableSubs(newSubList);
    setSub(newSubList[0]);
  }, [prime, isExpense]);

  const FilteredIncome = useMemo(() => {
    if (!FilteredIncomeList.length) return [];
    let filteredList = FilteredIncomeList;
    if (listFilter === TransactionFilters.BY_INCOME_CATEGORY) {
      return filteredList.filter(
        (e) => e.primeCategory === prime && e.subCategory === sub,
      );
    }
    const sortedList = [...filteredList];

    sortedList.sort((a, b) => {
      let aVal, bVal;

      if (sortList === TransactionSorts.BY_AMOUNT) {
        aVal = a.ofAmount;
        bVal = b.ofAmount;
      } else {
        // Default to date
        aVal = new Date(a.onDate);
        bVal = new Date(b.onDate);
      }

      if (sortOrder === 2) {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    return sortedList;
  }, [FilteredIncomeList, sub, sortList, sortOrder, listFilter, prime]);

  //NOTE - Filtered Expense List
  const FilteredExpenses = useMemo(() => {
    if (!FilteredExpenseList.length) return [];
    let filteredList = FilteredExpenseList;

    if (listFilter === TransactionFilters.IS_TRIP) {
      return filteredList.filter((e) => e.isTripExpense === true);
    }
    if (listFilter === TransactionFilters.IS_RECURRING) {
      return filteredList.filter((e) => e.isRecurringExpense === true);
    }
    if (listFilter === TransactionFilters.BY_PRIME) {
      return filteredList.filter((e) => e.primeCategory === prime);
    }
    if (listFilter === TransactionFilters.BY_SUB) {
      return filteredList.filter(
        (e) => e.primeCategory === prime && e.subCategory === sub,
      );
    }

    const sortedList = [...filteredList];

    sortedList.sort((a, b) => {
      let aVal, bVal;

      if (sortList === TransactionSorts.BY_AMOUNT) {
        aVal = a.ofAmount;
        bVal = b.ofAmount;
      } else {
        // Default to date
        aVal = new Date(a.onDate);
        bVal = new Date(b.onDate);
      }

      if (sortOrder === 2) {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    return sortedList;
  }, [listFilter, prime, sub, sortList, sortOrder, FilteredExpenseList]);

  return {
    ExpenseList,
    IncomeList,
    FilteredExpenseList,
    FilteredIncomeList,
    expenseLoading,
    expenseError,
    incomeLoading,
    incomeError,
    RecentTransactionList,
    GroupedTripExpenses,
    recentTransactionsLoading,
    FilteredExpenses,
    FilteredIncome,
    TransactionFilters,
    TransactionSorts,
    listFilter,
    sortList,
    prime,
    availableSubs,
    sub,
    handleListFilter,
    handlePrimeFilter,
    handleSubFilter,
    handleListSort,
    handleOrder,
    handleReset,
    expensePrimes,
  };
};

export default useTransactionConfig;
