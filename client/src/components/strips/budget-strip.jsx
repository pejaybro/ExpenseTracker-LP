import { Icons } from "../icons";
import Flexrow from "../section/flexrow";
import { amountInteger } from "../utilityFilter";
import TooltipStrip from "./tooltip-strip";

import UseBudgetConfig from "@/hooks/useBudgetConfig";

import HorizontalDivider from "./horizontal-divider";
import { cn } from "@/lib/utils";
import ExpButton from "../buttons/exp-button";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/router/routerConfig";
import VerticalDevider from "./vertical-devider";
import useBudgetConfig from "@/hooks/useBudgetConfig";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import { useMemo } from "react";

const BudgetStrip = ({ isHome, className }) => {
  const { BudgetByMonth, Budget } = useBudgetConfig();
  let isAnyBudgetExist = BudgetByMonth.some((b) => b.amount > 0);
  const { FilterMonth } = useFilterConfig();

  const budgetAmount =
    (isAnyBudgetExist &&
      BudgetByMonth?.find((b) => b.month === FilterMonth)?.amount) ||
    0;

  const navigate = useNavigate();

  return (
    <>
      <Flexrow
        className={cn(
          "text-slate-a1 w-full cursor-default items-center gap-2",
          className,
        )}
      >
        <Flexrow
          className={cn(
            "text-14px bg-dark-a3 shadow-dark-a1 font-para2-m mr-2 w-max flex-1 items-center gap-2.5 px-5 py-2 shadow-md",
            "rounded-sm",
          )}
        >
          <Icons.calc className={`text-bud-a2`} />
          {Budget && budgetAmount > 0 && (
            <>
              {"Your Monthly Budget is"}
              <VerticalDevider />
              <Flexrow className={"w-max items-center gap-1"}>
                <Icons.rupee className="!text-14px" />
                <h4>{amountInteger(budgetAmount)}</h4>
              </Flexrow>
            </>
          )}
          {(!Budget || budgetAmount <= 0) && <>{"No Monthly Budget Exist"}</>}
        </Flexrow>

        {(!Budget || budgetAmount <= 0) && (
          <>
            <ExpButton as="div" setBudget_textbtn />
          </>
        )}

        {Budget && budgetAmount > 0 && (
          <>
            <ExpButton as="div" editBudget_iconbtn />
            <ExpButton as="div" newBudget_iconbtn />

            <TooltipStrip content="Go To Budget">
              <ExpButton
                as="div"
                gotoPage_iconbtn
                onClick={() => navigate(PATH.budget)}
                className={"bg-bud-a3 text-dark-a2"}
              />
            </TooltipStrip>
          </>
        )}
      </Flexrow>
    </>
  );
};

export default BudgetStrip;

{
  /* <TooltipStrip content="Edit Current Budget">
                <ExpButton isIcon btnfor="budget" label={<Icons.caledit />} />
              </TooltipStrip> */
}
