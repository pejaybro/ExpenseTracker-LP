import { ArrayCheck } from "@/components/utility";
import { percentSigned, percentUnSigned } from "@/components/utilityFilter";
import {
  BudgetExpenseComboOfSelectedYear,
  selectBudgetByMonth,
  selectBudgetData,
  selectBudgetList,
} from "@/redux/selectors/budget-selector";
import { selectBudgetNotification } from "@/redux/slices/notification-slice";

import { useSelector } from "react-redux";

const useBudgetConfig = () => {
  const { BudgetLoading, BudgetError, BudgetInsertLoading, BudgetInsertError } =
    useSelector((state) => state.budget);
  const Budget = useSelector(selectBudgetData);
  const BudgetByMonth = useSelector(selectBudgetByMonth);
  const BudgetList = useSelector(selectBudgetList);
  const BudgetWithExpense = useSelector(BudgetExpenseComboOfSelectedYear);
  const BudgetNotification = useSelector(selectBudgetNotification);

  //NOTE - creates a group of budget in month range
  const createBudgetRange = (data) => {
    const checkedData = ArrayCheck(data);
    if (!checkedData) return [];
    const result = [];
    let start = checkedData[0].month;
    let currentBudget = checkedData[0].budget;
    for (let i = 1; i < checkedData.length; i++) {
      if (checkedData[i].budget !== currentBudget) {
        result.push({
          start,
          end: checkedData[i - 1].month,
          budget: currentBudget,
        });

        start = checkedData[i].month;
        currentBudget = checkedData[i].budget;
      }
    }
    // Push the last group
    result.push({
      start,
      end: checkedData[checkedData.length - 1].month,
      budget: currentBudget,
    });
    return result;
  };

  return {
    Budget,
    BudgetByMonth,
    BudgetList,
    createBudgetRange,
    BudgetWithExpense,
    BudgetLoading,
    BudgetError,
    BudgetInsertLoading,
    BudgetInsertError,
    BudgetNotification,
  };
};

export default useBudgetConfig;

export const getBudgetExpPercent = (b, e) => {
  if (b === 0) return 0;
  const diff = e - b;
  const percent = (diff / b) * 100;
  return percent;
};
