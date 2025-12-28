// --- React & Related ---
import { useNavigate } from "react-router-dom";

// --- 3rd Party Libraries ---
import { Spinner } from "flowbite-react";

// --- App Hooks ---
import useTransactionConfig from "@/hooks/useTransactionConfig";

// --- App Components ---
import { LinearGraphData } from "@/components/analysis/linear-graph-data";
import ExpButton from "@/components/buttons/exp-button";
import TotalCardForMonth from "@/components/cards/total-card-for-month";
import TotalCardForYear from "@/components/cards/total-card-for-year";
import { Icons } from "@/components/icons";
import MonthCalander from "@/components/month-calender";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import MaxCategorySection from "@/components/section/max-category-section";
import SectionTitle from "@/components/section/section-title";
import BudgetStrip from "@/components/strips/budget-strip";
import TransactionListTable from "@/components/table/transaction-list-table";
import NewIncome from "./NewIncome";

// --- App Utilities & Config ---
import { PATH } from "@/router/routerConfig";
import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";
import SelectBar from "@/components/selectFilter/SelectBar";
import SelectCard from "@/components/selectFilter/SelectCard";
import SelectFilter from "@/components/selectFilter/SelectFilter";
import { cn } from "@/lib/utils";
import { SimplyManage } from "../home";
import { AddInc } from "@/components/Navigation/bottom-bar";

const IncomeIndex = () => {
  const navigate = useNavigate();
  const {
    IncomeList,
    incomeLoading,
    incomeError,
    FilteredIncome,
    listFilter,
    TransactionFilters,
    TransactionSorts,
    sortList,
    availableSubs,
    sub,
    handleOrder,
    handleReset,
    handleListFilter,
    handleSubFilter,
    handleListSort,
  } = useTransactionConfig();

  // NOTE: 1. Handle the loading state first
  if (incomeLoading) {
    // Replace with your preferred loading spinner component
    return (
      <Flexrow className="h-full items-center justify-center">
        <Spinner
          className="text-slate-a3 fill-inc-a1"
          size="lg"
          aria-label="expense page loader"
        />
      </Flexrow>
    );
  }

  // NOTE: 2. Handle the error state next
  if (incomeError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {incomeError}
        </Flexrow>
      </>
    );
  }

  //NOTE: 3. Handle the "no data" state
  if (!IncomeList || IncomeList.length === 0) {
    // This gives the user a clear message if there's nothing to show
    return (
      <Flexcol>
        <NewIncome />
      </Flexcol>
    );
  }

  // NOTE: 4. If all checks pass, render the main content
  return (
    <Flexcol className="gap-10">
      {/** ====== Cards : Monhly & Yearly Transactions || Calander ====== */}
      <Flexrow className="items-stretch justify-center gap-10">
        <Flexcol className="w-max justify-between">
          <TotalCardForYear
            className={"w-full max-w-[350px] min-w-[350px] shrink-0"}
            year={CurrentYear()}
          />
          <TotalCardForMonth
            className={"w-full max-w-[350px] min-w-[350px] shrink-0"}
            year={CurrentYear()}
            month={CurrentMonth()}
          />
        </Flexcol>
        <Flexcol className="w-max">
          <MonthCalander list={IncomeList ?? []} />
          <AddInc className={"w-full"} />
        </Flexcol>
      </Flexrow>
      {/** ====== Income Graph ====== */}
      <LinearGraphData isIncome />
      {/** ====== Transaction Filter ====== */}
      <SectionTitle title="Income Transactions" />
      <Flexcol className="gap-2.5">
        <Flexrow>
          <SelectBar className={"bg-inc-a3 text-dark-a3 w-max gap-1.25"}>
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
              className={cn("bg-dark-a3", "hover:bg-inc-a3 hover:text-dark-a3")}
              onClick={() => handleOrder()}
            >
              <Icons.list_order />
            </ExpButton>
            <ExpButton
              custom_iconbtn
              custom_toolContent="Reset"
              className={cn("bg-dark-a3", "hover:bg-inc-a3 hover:text-dark-a3")}
              onClick={() => handleReset()}
            >
              <Icons.list_reset />
            </ExpButton>
          </Flexrow>
        </Flexrow>
        {listFilter === TransactionFilters.BY_INCOME_CATEGORY && (
          <Flexrow className={"w-max"}>
            <SelectBar className={"bg-inc-a3 text-dark-a3 gap-1.25"}>
              <SelectCard noIcon isExpense title={"Category"}>
                <SelectFilter
                  placeholder={"Select Type"}
                  value={sub}
                  onValueChange={handleSubFilter}
                  list={availableSubs}
                />
              </SelectCard>
            </SelectBar>
          </Flexrow>
        )}
      </Flexcol>
      {/** ====== Transaction List ====== */}
      <TransactionListTable isIncome entries={FilteredIncome ?? []} />
    </Flexcol>
  );
};

export default IncomeIndex;

/**!SECTION
 * 
 * 
 * 
 * 
 *  <Flexcol className="pt-20"></Flexcol>
      <Flexcol className="pt-20">
        <SectionTitle title="Top 5 Maximum Expense Categories" isIncome />
        <MaxCategorySection />
        <Flexrow className="text-14px items-center justify-end pt-5 font-para2-m">
          <h4>For Detailed Income Analysis</h4>
          <ExpButton
            custom_textbtn
            className={"bg-inc"}
            onClick={() => navigate(PATH.incomeAnalysis)}
          >
            <Icons.upbar /> Check Analysis
          </ExpButton>
        </Flexrow>
      </Flexcol>
 */
