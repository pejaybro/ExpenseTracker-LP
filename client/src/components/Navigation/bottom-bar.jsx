import Flexrow from "../section/flexrow";
import VerticalDevider from "../strips/vertical-devider";
import { PATH } from "@/router/routerConfig";
import { cn } from "@/lib/utils";
import { baseBtn, Btn_text } from "@/global/style";
import { Icons } from "../icons";
import { useNavigate } from "react-router-dom";
import ExpButton from "../buttons/exp-button";
import useBudgetConfig from "@/hooks/useBudgetConfig";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import { useMemo } from "react";
import useTotalConfig from "@/hooks/useTotalConfig";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";

export const BudgetBarIndicator = () => {
  const { BudgetByMonth } = useBudgetConfig();
  const { FilterMonth } = useFilterConfig();
  const currentBudget = useMemo(
    () => BudgetByMonth?.find((b) => b.month === FilterMonth),
    [BudgetByMonth, FilterMonth],
  );
  const { TotalByMonth_EXP, getTotalInMonthOfYear } = useTotalConfig();
  const exp = getTotalInMonthOfYear(
    TotalByMonth_EXP,
    CurrentYear(),
    CurrentMonth(),
  );

  const budgetRemaining = currentBudget?.amount - exp;
  const percent = Math.max(
    0,
    Math.min(Math.round((exp / currentBudget?.amount) * 100), 100),
  );
  return (
    <>
      {!currentBudget?.amount && <span>No Monthly Budget Exist</span>}
      {currentBudget?.amount && (
        <Flexrow className={"text-14px font-para2-m items-center gap-2"}>
          <Icons.calc className="text-12px" />
          <span>Budget</span>
          <VerticalDevider />
          <span>Spent : Rs {exp}</span>
          <div className="bg-dark-a6 h-2.5 w-[25%] rounded-sm">
            <div
              style={{ width: `${percent}%` }}
              className="bg-bud-a1 h-full rounded-sm"
            />
          </div>
          <span>Remaining : Rs {budgetRemaining}</span>
        </Flexrow>
      )}
    </>
  );
};

export const AddExp = () => {
  const navigate = useNavigate();
  return (
    <ExpButton
      custom_textbtn
      className={cn("text-dark-a1 bg-exp-a3 font-para2-m w-max")}
      onClick={() => navigate(PATH.addExpense)}
    >
      <Icons.add_list className="text-18px" />
      <span className="text-14px"> New Expense</span>
    </ExpButton>
  );
};
export const AddInc = () => {
  const navigate = useNavigate();
  return (
    <ExpButton
      custom_textbtn
      className={cn("text-dark-a1 bg-inc-a2 font-para2-m w-max")}
      onClick={() => navigate(PATH.addIncome)}
    >
      <Icons.add_list className="text-18px" />
      <span className="text-14px"> New Income</span>
    </ExpButton>
  );
};

export const AddBudget = () => {
  return <ExpButton className={"h-max w-max"} as="div" setBudget_textbtn />;
};
