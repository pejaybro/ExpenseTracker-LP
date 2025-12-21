// --- Components ---

import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";

import ActiveBudgetCard from "@/components/cards/active-budget-card";

import BudgetTable from "@/components/table/budget-table";

import ExpButton from "@/components/buttons/exp-button";

import useBudgetConfig, { getBudgetExpPercent } from "@/hooks/useBudgetConfig";

import { Spinner } from "flowbite-react";
import { useDispatch } from "react-redux";
import { deleteBudget } from "@/redux/slices/budget-slice";
import {
  CurrentMonth,
  CurrentYear,
  getMonthName,
} from "@/utilities/calander-utility";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ComboTable } from "@/components/table/combo-table";

import { DualGraphCode } from "@/components/charts/dual-graph-code";

import { GraphTitleSquare } from "@/components/analysis/linear-graph-data";
import { useMemo } from "react";
import BudgetStrip from "@/components/strips/budget-strip";
import TooltipStrip from "@/components/strips/tooltip-strip";

const BudgetIndex = () => {
  //NOTE - BUDGET CONFIG
  const {
    Budget,
    BudgetLoading,
    BudgetError,
    BudgetByMonth,
    BudgetWithExpense,
  } = useBudgetConfig();
  const dispatch = useDispatch();

  let isAnyBudgetExist = BudgetByMonth.some((b) => b.amount > 0);

  const { BudgetExpenseGraphData, bugetYearTotal, expenseYearTotal } =
    useMemo(() => {
      const BudgetExpenseGraphData = BudgetWithExpense.map((b) => ({
        ...b,
        indicator: getMonthName(b.month),
      }));
      const bugetYearTotal = BudgetWithExpense.reduce(
        (sum, b) => b.budget + sum,
        0,
      );
      const expenseYearTotal = BudgetWithExpense.reduce(
        (sum, b) => b.expense + sum,
        0,
      );
      return { BudgetExpenseGraphData, bugetYearTotal, expenseYearTotal };
    }, [BudgetWithExpense]);

  const DashboardGraphInfo = {
    data: BudgetExpenseGraphData,
    type1: "expense",
    type1Color: "var(--color-exp-a1)",
    type2: "budget",
    type2Color: "var(--color-bud-a1)",
  };

  const chartInfo = {
    title: (
      <>
        <Flexrow className={"w-max items-center gap-1.25"}>
          <GraphTitleSquare className={cn("bg-bud-a1")} />
          <span className="mr-5">Budget Vs Expense </span>
        </Flexrow>
      </>
    ),
    subtext: "Tracking monthly expenses over budget",
    footertext: "Showing record of each month.",
  };

  const handleDeleteBudget = () => {
    const data = {
      userID: 123456,
      year: CurrentYear(),
      month: CurrentMonth(),
      amount: 0,
    };
    return new Promise((resolve) => {
      toast.custom((t) => (
        <Flexrow
          className={cn(
            "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
          )}
        >
          <Flexcol className="flex-1 gap-0">
            <span className="font-para2-m">Delete Budget ?</span>
            <span>Do you want to delete ?</span>
          </Flexcol>

          <Flexrow className="w-max justify-end gap-2">
            <ExpButton
              custom_textbtn
              className="bg-ggbg"
              onClick={async () => {
                toast.dismiss(t);
                try {
                  await dispatch(deleteBudget({ data })).unwrap();
                  toast.success("Success!", {
                    description: "Your budget has been deleted.",
                    action: {
                      label: "Ok!",
                      onClick: () => {},
                    },
                  });
                } catch (error) {
                  toast.error("Operation Failed", {
                    description: error, // 'error' is the clean error message from rejectWithValue
                    action: {
                      label: "Ok!",
                      onClick: () => {},
                    },
                  });
                }
              }}
            >
              Yes
            </ExpButton>
            <ExpButton
              custom_textbtn
              className="bg-rrbg"
              onClick={() => {
                toast.dismiss(t);
                resolve(false);
              }}
            >
              No
            </ExpButton>
          </Flexrow>
        </Flexrow>
      ));
    });
  };

  // NOTE: 1. Handle the loading state first
  if (BudgetLoading) {
    return (
      <Flexrow className="h-full items-center justify-center">
        <Spinner
          className="text-slate-a3 fill-exp-a1"
          size="lg"
          aria-label="expense page loader"
        />
      </Flexrow>
    );
  }
  // NOTE: 2. Handle the error state next
  if (BudgetError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {BudgetError}
        </Flexrow>
      </>
    );
  }
  // NOTE: 3. Handle the "no data" state
  if (!Budget || Budget.length === 0 || !isAnyBudgetExist) {
    // This gives the user a clear message if there's nothing to show
    return <NewBudget />;
  }
  // NOTE: 4. If all checks pass, render the main content
  return (
    <>
      <Flexrow>
        <Flexcol className="items-center">
          <ActiveBudgetCard />
          <Flexrow className="justify-between gap-2.5">
            <ExpButton className={"flex-1"} as="div" newBudget_textbtn />
            <ExpButton className={"flex-1"} as="div" editBudget_textbtn />
            <TooltipStrip content="Delete Current Budget">
              <ExpButton
                onClick={handleDeleteBudget}
                className={"bg-error-a1 text-slate-a1"}
                delete_iconbtn
              />
            </TooltipStrip>
          </Flexrow>
        </Flexcol>
        <Flexcol className="items-center">
          <BudgetTable />
        </Flexcol>
      </Flexrow>
      <Flexrow className={"mt-5"}>
        <DualGraphCode
          isBudgetExpenseCombo
          graphInfo={DashboardGraphInfo}
          chartInfo={chartInfo}
        />
      </Flexrow>
      <Flexrow className={"mt-5"}>
        <ComboTable data={BudgetWithExpense} isBudgeting />
      </Flexrow>
    </>
  );
};

export default BudgetIndex;

export const NewBudget = () => {
  return (
    <Flexcol className={"m-auto max-w-[600px] items-center"}>
      <div className="text-dark-a0 flex h-[250px] w-[600px] shrink-0 items-center justify-center rounded-lg bg-amber-400"></div>

      <BudgetStrip className="w-full" />
    </Flexcol>
  );
};
