import { selectRecurringCalculation } from "@/redux/selectors/total-selector";
import { selectRecurringExpenseList } from "@/redux/selectors/transaction-selector";
import { selectNotifications } from "@/redux/slices/notification-slice";
import { useSelector } from "react-redux";

const useRecurringConfig = () => {
  // Directly select the final, memoized data. No useMemo needed.
  const RecurringList = useSelector(selectRecurringExpenseList);
  const RecurringData = useSelector(selectRecurringCalculation);

  const notifications = useSelector(selectNotifications);

  // You can still select loading/error states if needed
  const { recurringLoading, recurringError } = useSelector(
    (state) => state.transaction,
  );

  const createExpenseData = (id) => {
    const rec = RecurringList?.find((r) => String(r._id) === id);
    return rec ?? null;
  };
  return {
    RecurringList,
    RecurringData,
    recurringLoading,
    recurringError,
    notifications,
    createExpenseData,
  };
};

export default useRecurringConfig;
