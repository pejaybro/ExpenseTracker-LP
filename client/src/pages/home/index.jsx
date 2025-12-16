import Flexrow from "@/components/section/flexrow";
import TypewriterAni from "../../components/TypewriterAni";
import { bgDarkA3 } from "@/global/style";
import { cn } from "@/lib/utils";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";
import TotalCardForYear from "@/components/cards/total-card-for-year";
import TotalCardForMonth from "@/components/cards/total-card-for-month";
import TransactionListTable from "@/components/table/transaction-list-table";
import useTransactionConfig from "@/hooks/useTransactionConfig";
import Flexcol from "@/components/section/flexcol";
import BudgetStrip from "@/components/strips/budget-strip";
import useRecurringConfig from "@/hooks/useRecurringConfig";

import { DualGraphCode } from "@/components/charts/dual-graph-code";
import { DualGraphData } from "@/components/analysis/dual-graph-data";
import { IconLibrary } from "@/components/IconLibearay";
import specely from "@/assets/specely.png";
import { Icons } from "@/components/icons";
import NewExpense from "../expense/NewExpense";
import NewIncome from "../income/NewIncome";

const HomeIndex = () => {
  const { RecentTransactionList, recentTransactionsLoading } =
    useTransactionConfig();

  // NOTE: 1. Handle the loading state first
  if (recentTransactionsLoading) {
    // Replace with your preferred loading spinner component
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
  if (!RecentTransactionList || RecentTransactionList.length === 0) {
    // This gives the user a clear message if there's nothing to show
    return (
      <Flexcol>
        <WelcomeSection className="pb-0" />
        <SimplyManage />
        <NewExpense />
        <NewIncome />
      </Flexcol>
    );
  }

  return (
    <>
      {/*  <Flexrow
        className={cn(
          "!text-14px mb-5 w-full gap-2.5 rounded-sm border px-5 py-0.5",
          bgDarkA3,
        )}
      >
        <Flexrow className="w-1/2 justify-start">Card Section</Flexrow>
        <Flexrow className="w-1/2 justify-end">FF</Flexrow>
      </Flexrow> */}

      <WelcomeSection />
      <SimplyManage />

      <Flexrow className={"mb-5 flex-wrap"}>
        <DualGraphData isDashboard />
        <BudgetStrip className="w-full lg:flex-1 lg:basis-[280px]" />
        <Flexrow className={"mb-20 flex-wrap"}>
          <TotalCardForYear
            className="w-full lg:flex-1 lg:basis-[280px]"
            isExpense
          />
          <TotalCardForMonth
            className="w-full lg:flex-1 lg:basis-[280px]"
            isExpense
            year={CurrentYear()}
            month={CurrentMonth()}
          />
          <TotalCardForYear className="w-full lg:flex-1 lg:basis-[280px]" />
          <TotalCardForMonth
            className="w-full lg:flex-1 lg:basis-[280px]"
            year={CurrentYear()}
            month={CurrentMonth()}
          />
          <TotalCardForYear
            isReccuring
            className="w-full lg:flex-1 lg:basis-[280px]"
          />
          <TotalCardForMonth
            isReccuring
            className="w-full lg:flex-1 lg:basis-[280px]"
            year={CurrentYear()}
            month={CurrentMonth()}
          />
        </Flexrow>
      </Flexrow>

      <Flexrow className={"border-dark-a1 bg-dark-a0 mb-5 rounded-lg border"}>
        <div className="text-dark-a0 flex h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>
        <div className="font-title text-36px flex items-center tracking-wide">
          <span>Your Latest Transactions</span>
        </div>
      </Flexrow>
      <Flexcol>
        <TransactionListTable
          isExpesne
          isRecent
          entries={RecentTransactionList ?? []}
        />
      </Flexcol>
      <IconLibrary />
    </>
  );
};

export default HomeIndex;

export const WelcomeSection = ({ className }) => {
  return (
    <Flexrow className={cn("items-center gap-2 pb-5", className)}>
      <Icons.handPeace className="text-28px text-exp-a1" />
      <span className="font-title text-32px tracking-wide">
        Welcome, <span className="text-exp-a1">Prayas</span>
      </span>
      <span>- Begin your journey by adding your first entry.</span>
    </Flexrow>
  );
};

export const SimplyManage = () => {
  return (
    <Flexrow className={"border-dark-a1 bg-dark-a0 rounded-lg border"}>
      <div className="text-dark-a0 flex h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
        image here
      </div>
      <div className="flex items-center">
        <TypewriterAni isDashboard />
      </div>
    </Flexrow>
  );
};
