import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget } from "@/redux/slices/budget-slice";
import { fetchMM } from "@/redux/slices/minmax-slice";
import { fetchTotal } from "@/redux/slices/total-slice";
import {
  fetchExpense,
  fetchIncome,
  fetchRecurringExpense,
} from "@/redux/slices/transaction-slice";
import { fetchTrips } from "@/redux/slices/trip-slice";

const useDashboardLoad = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    if (!userId) return;

    dispatch(fetchRecurringExpense());
    dispatch(fetchExpense());
    dispatch(fetchIncome());
    dispatch(fetchBudget());
    dispatch(fetchTotal());
    dispatch(fetchMM());
    dispatch(fetchTrips());
  }, [dispatch, userId]);
};

export default useDashboardLoad;
