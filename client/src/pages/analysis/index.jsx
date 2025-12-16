import ExpenseCategoryAnalysis from "@/components/analysis/Expense-Category-Analysis";
import { LinearGraphData } from "@/components/analysis/linear-graph-data";
import { DualGraphData } from "@/components/analysis/dual-graph-data";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import SectionTitle from "@/components/section/section-title";
import useTransactionConfig from "@/hooks/useTransactionConfig";
import { Spinner } from "flowbite-react";
import NewExpense from "../expense/NewExpense";
import useTotalConfig from "@/hooks/useTotalConfig";
import { ComboTable } from "@/components/table/combo-table";
import TotalCardForYear from "@/components/cards/total-card-for-year";
import TotalCardForMonth from "@/components/cards/total-card-for-month";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";
import PieGraphCode from "@/components/charts/pie-graph-code";
import IncomeCategoryAnalysis from "@/components/analysis/Income-Category-Analysis";
import { SimplyManage } from "../home";
import NewIncome from "../income/NewIncome";

export const Index = () => {
  const { ExpenseList, expenseLoading, expenseError } = useTransactionConfig();
  const {
    IncomeExpenseCombo,
    ExpensePrimeCategory,
    FilteredZerosSubCategory,
    FilteredZerosExpensePrimeCategory,
    SubCategory,
  } = useTotalConfig();

  // NOTE: 1. Handle the loading state first
  if (expenseLoading) {
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
  if (expenseError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {expenseError}
        </Flexrow>
      </>
    );
  }
  // NOTE: 3. Handle the "no data" state
  if (!ExpenseList || ExpenseList.length === 0) {
    // This gives the user a clear message if there's nothing to show
    return (
      <Flexcol>
        <SimplyManage />
        <NewExpense />
        <NewIncome />
      </Flexcol>
    );
  }
  // NOTE: 4. If all checks pass, render the main content

  const graphInfo = {
    data: FilteredZerosExpensePrimeCategory,
    sub: SubCategory.expenses,
  };
  return (
    <>
      <Flexcol>
        <Flexrow className={"flex-wrap"}>
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
        </Flexrow>
        <LinearGraphData graphHeightClass="max-h-[350px]" isExpense />
        <LinearGraphData graphHeightClass="max-h-[350px]" isIncome />
        <DualGraphData isDashboard />
        <ComboTable isAnalysis data={IncomeExpenseCombo} />
        <PieGraphCode graphInfo={graphInfo} />
        <IncomeCategoryAnalysis />
      </Flexcol>
    </>
  );
};
