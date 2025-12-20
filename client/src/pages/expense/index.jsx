// --- 3rd Party Libraries ---
import { Spinner } from "flowbite-react";
import { cn } from "@/lib/utils";

// --- App Hooks ---
import useTransactionConfig from "@/hooks/useTransactionConfig";

// --- App Components ---
import { LinearGraphData } from "@/components/analysis/linear-graph-data";
import ExpButton from "@/components/buttons/exp-button";
import { Icons } from "@/components/icons";
import MonthCalander from "@/components/month-calender";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";

import SelectBar from "@/components/selectFilter/SelectBar";
import SelectCard from "@/components/selectFilter/SelectCard";
import SelectFilter from "@/components/selectFilter/SelectFilter";

import TransactionListTable from "@/components/table/transaction-list-table";
import NewExpense from "./NewExpense";

import { bgDarkA3 } from "@/global/style";
import { SimplyManage } from "../home";

const ExpenseIndex = () => {
  /** =========== Transaction Config =========== */
  const {
    ExpenseList,
    FilteredExpenses,
    expenseLoading,
    expenseError,
    TransactionFilters,
    TransactionSorts,
    listFilter,
    sortList,
    prime,
    availableSubs,
    sub,
    handleListFilter,
    handlePrimeFilter,
    handleSubFilter,
    handleListSort,
    handleOrder,
    handleReset,
    expensePrimes,
  } = useTransactionConfig({ isExpense: true });

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
        <NewExpense />
      </Flexcol>
    );
  }
  // NOTE: 4. If all checks pass, render the main content
  return (
    <>
      <Flexcol className="gap-10">
        {/** =========== Top - Budget Strip & Add Exp Btn =========== */}

        <LinearGraphData isExpense />
        <Flexrow className={"bg-dark-a0 rounded-lg"}>
          <div className="text-dark-a0 flex h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
          <div className="font-title text-36px flex items-center tracking-wide">
            <span>Your Latest Transactions</span>
          </div>
        </Flexrow>
        <Flexcol className="gap-2.5">
          <Flexrow>
            <SelectBar className={"bg-exp-a3 text-dark-a3 gap-1.25"}>
              <span>
                <Icons.filter_funnel className="text-18px" />
              </span>
              <SelectCard title={"List Filter"}>
                <SelectFilter
                  placeholder={"Select Type"}
                  value={listFilter}
                  onValueChange={handleListFilter}
                  list={Object.values(TransactionFilters)}
                />
              </SelectCard>
              <SelectCard>
                <SelectFilter
                  placeholder={"Select Type"}
                  value={sortList}
                  onValueChange={handleListSort}
                  list={Object.values(TransactionSorts)}
                />
              </SelectCard>
            </SelectBar>

            <Flexrow className={"text-18px items-center gap-2.5"}>
              <ExpButton
                custom_iconbtn
                custom_toolContent="Change Order"
                className={cn(
                  "bg-dark-a3",
                  "hover:bg-exp-a3 hover:text-dark-a3",
                )}
                onClick={() => handleOrder()}
              >
                <Icons.list_order />
              </ExpButton>
              <ExpButton
                custom_iconbtn
                custom_toolContent="Reset"
                className={cn(
                  "bg-dark-a3",
                  "hover:bg-exp-a3 hover:text-dark-a3",
                )}
                onClick={() => handleReset()}
              >
                <Icons.list_reset />
              </ExpButton>
            </Flexrow>
          </Flexrow>

          {(listFilter === TransactionFilters.BY_PRIME ||
            listFilter === TransactionFilters.BY_SUB) && (
            <Flexrow className={"w-max"}>
              <SelectBar className={"bg-exp-a3 text-dark-a3 gap-1.25"}>
                {listFilter === TransactionFilters.BY_SUB && (
                  <SelectCard className={"pr-2"} title={"Sub Category "}>
                    <SelectFilter
                      placeholder={"Select Type"}
                      value={sub}
                      onValueChange={handleSubFilter}
                      list={availableSubs}
                    />
                  </SelectCard>
                )}
                <SelectCard
                  title={
                    listFilter === TransactionFilters.BY_SUB
                      ? "of Prime "
                      : "Category"
                  }
                >
                  <SelectFilter
                    placeholder={"Select Type"}
                    value={prime}
                    onValueChange={handlePrimeFilter}
                    list={expensePrimes}
                  />
                </SelectCard>
              </SelectBar>
            </Flexrow>
          )}
        </Flexcol>
        <TransactionListTable isExpesne entries={FilteredExpenses ?? []} />
      </Flexcol>
    </>
  );
};

export default ExpenseIndex;

export const Manage = () => {
  return (
    <Flexrow className={"rounded-lg"}>
      <div className="text-dark-a0 flex max-h-full min-h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
        image here
      </div>
      <div className="flex flex-col justify-center">
        {/*  <MonthCalander isExpense list={ExpenseList ?? []} /> */}
        <span className="font-title text-36px tracking-wide">
          Track Your Expenses
        </span>
        <ExpButton className={"max-w-[240px]"} addExpense />
      </div>
    </Flexrow>
  );
};
