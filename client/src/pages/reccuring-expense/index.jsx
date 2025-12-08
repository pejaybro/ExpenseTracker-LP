// --- React Core ---
import React, { useEffect, useMemo } from "react";

// --- 3rd Party Libraries ---
import { Spinner } from "flowbite-react";

// --- App Hooks ---
import useRecurringConfig from "@/hooks/useRecurringConfig";

// --- App Components ---
import ExpButton from "@/components/buttons/exp-button";
import TotalCardForMonth from "@/components/cards/total-card-for-month";
import TotalCardForYear from "@/components/cards/total-card-for-year";
import { LinearGraphCode } from "@/components/charts/linear-graph-code";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import SectionTitle from "@/components/section/section-title";
import HorizontalDivider from "@/components/strips/horizontal-divider";
import RecurringExpenseTable from "@/components/table/recurring-expense-table";
import NewReccuringExpense from "./NewReccuringExpense";

// --- App Utilities ---
import { amountFloat } from "@/components/utilityFilter";
import {
  CurrentMonth,
  CurrentYear,
  getMonthName,
} from "@/utilities/calander-utility";
import { GraphTitleSquare } from "@/components/analysis/linear-graph-data";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

const ReccuringExpenseIndex = () => {
  const { RecurringList, RecurringData, recurringLoading, recurringError } =
    useRecurringConfig();

  const notis = useSelector(
    (state) => state.notifications?.RecurringNotifications,
  );


  const { RecTotal, GraphData } = useMemo(() => {
    const GraphData = RecurringData?.GraphData?.map((r) => ({
      indicator: getMonthName(r.month),
      Amount: r.amount,
    }));
    const RecTotal = RecurringData?.MonthlyTotal + RecurringData?.YearlyTotal;
    return { RecTotal, GraphData };
  }, [RecurringData]);

  const graphInfo = useMemo(
    () => ({
      data: GraphData,
      label: "Expense",
      color: "var(--color-rep-a1)",
    }),
    [RecurringData],
  );

  const chartInfo = useMemo(
    () => ({
      title: (
        <Flexrow className={"items-center gap-1.25"}>
          <GraphTitleSquare className={cn("bg-rep-a1")} />
          <span className="mr-5">
            Recurring Expense in Year {CurrentYear()}
          </span>
          <Icons.checkCircle className={cn("text-rep-a1")} />
          <span>Rs.</span>
          <span className={cn("text-rec-a1")}>{amountFloat(RecTotal)}</span>
        </Flexrow>
      ),
      subtext: `Tracking monthly recurring expenses`,
      footertext: `Showing total recurring expense record of each month for year ${CurrentYear()} `,
    }),
    [RecurringData],
  );

  // NOTE: 1. Handle the loading state first
  if (recurringLoading) {
    // Replace with your preferred loading spinner component
    return (
      <Flexrow className="h-full items-center justify-center">
        <Spinner
          className="text-slate-a3 fill-rep-a1"
          size="lg"
          aria-label="expense page loader"
        />
      </Flexrow>
    );
  }

  // NOTE: 2. Handle the error state next
  if (recurringError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {recurringError}
        </Flexrow>
      </>
    );
  }

  //NOTE: 3. Handle the "no data" state
  if (!RecurringList || RecurringList.length === 0) {
    // This gives the user a clear message if there's nothing to show
    return <NewReccuringExpense />;
  }

  // NOTE: 4. If all checks pass, render the main content

  return (
    <>
      <Flexcol className="gap-8">
        <Flexrow className={"rounded-lg"}>
          <div className="text-dark-a0 flex max-h-full min-h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
          <div className="flex flex-col justify-center">
            {/*  <MonthCalander isExpense list={ExpenseList ?? []} /> */}
            <span className="font-title text-36px tracking-wide">
              Create Recurring Expense
            </span>
            <ExpButton className={"max-w-[240px]"} addReccuring />
          </div>
        </Flexrow>
        <Flexrow className="flex-wrap justify-center">
          <TotalCardForYear
            className="w-full lg:flex-1 lg:basis-[280px]"
            isReccuring
            year={CurrentYear()}
          />
          <TotalCardForMonth
            className="w-full lg:flex-1 lg:basis-[280px]"
            isReccuring
            year={CurrentYear()}
            month={CurrentMonth()}
          />
        </Flexrow>

        <LinearGraphCode
          graphHeightClass="max-h-[350px]"
          graphInfo={graphInfo}
          chartInfo={chartInfo}
        />
        <RecurringExpenseTable entries={RecurringList ?? []} />
      </Flexcol>
    </>
  );
};

export default ReccuringExpenseIndex;
