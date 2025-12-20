import Flexrow from "../section/flexrow";
import VerticalDevider from "../strips/vertical-devider";
import { PATH } from "@/router/routerConfig";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { useNavigate } from "react-router-dom";
import ExpButton from "../buttons/exp-button";
import useBudgetConfig from "@/hooks/useBudgetConfig";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import { useMemo } from "react";
import useTotalConfig from "@/hooks/useTotalConfig";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";
import { Progress } from "../ui/progress";
import { bgDarkA3 } from "@/global/style";

/**
 * ========================================================
 * ? Budget Component Bottom
 * ========================================================
 */
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

  //NOTE ----- if no budget exist -----
  if (currentBudget?.amount <= 0) return;

  //NOTE ----- if budget exist -----
  return (
    <Flexrow
      className={cn(
        "text-14px font-para2-m items-center justify-start gap-2.5 rounded-sm px-4 py-1.5",
        bgDarkA3,
      )}
    >
      <Icons.calc className="text-12px" />
      <span>Budget</span>
      <VerticalDevider />
      <span>Spent : Rs {exp}</span>

      <Progress
        value={percent}
        className={"bg-slate-a8 [&>div]:bg-bud-a1 h-2.5 flex-1 rounded-md"}
      />

      {/* old code 
       <div className="bg-dark-a6 h-2.5 flex-1 rounded-sm">
        <div
          style={{ width: `${percent}%` }}
          className="bg-bud-a1 h-full rounded-sm"
        />
      </div> */}
      <span>Remaining : Rs {budgetRemaining}</span>
    </Flexrow>
  );
};

export const AddExp = () => {
  const { BudgetByMonth } = useBudgetConfig();
  const { FilterMonth } = useFilterConfig();
  const currentBudget = useMemo(
    () => BudgetByMonth?.find((b) => b.month === FilterMonth),
    [BudgetByMonth, FilterMonth],
  );
  const className = currentBudget?.amount <= 0 ? "flex-1" : "w-max";
  const navigate = useNavigate();
  return (
    <ExpButton
      custom_textbtn
      className={cn("text-dark-a1 bg-exp-a3 font-para2-m", className)}
      onClick={() => navigate(PATH.addExpense)}
    >
      <Icons.add_list className="text-18px" />
      <span className="text-14px"> New Expense</span>
    </ExpButton>
  );
};
export const AddInc = () => {
  const { BudgetByMonth } = useBudgetConfig();
  const { FilterMonth } = useFilterConfig();
  const currentBudget = useMemo(
    () => BudgetByMonth?.find((b) => b.month === FilterMonth),
    [BudgetByMonth, FilterMonth],
  );
  const className = currentBudget?.amount <= 0 ? "flex-1" : "w-max";
  const navigate = useNavigate();
  return (
    <ExpButton
      custom_textbtn
      className={cn("text-dark-a1 bg-inc-a2 font-para2-m", className)}
      onClick={() => navigate(PATH.addIncome)}
    >
      <Icons.add_list className="text-18px" />
      <span className="text-14px"> New Income</span>
    </ExpButton>
  );
};

export const AddBudget = () => {
  const { BudgetByMonth } = useBudgetConfig();
  let isAnyBudgetExist = BudgetByMonth.find(
    (b) => b.month === CurrentMonth(),
  )?.amount;

  if (!isAnyBudgetExist || isAnyBudgetExist <= 0)
    return (
      <ExpButton className={cn("h-max flex-1")} as="div" setBudget_textbtn />
    );
  else return;
};
