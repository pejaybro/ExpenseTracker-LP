import ExpButton from "@/components/buttons/exp-button";
import TripExpenseForm from "@/components/Forms/trip-expense-form";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import TransactionListTable from "@/components/table/transaction-list-table";
import useTransactionConfig from "@/hooks/useTransactionConfig";
import useTripConfig from "@/hooks/useTripConfig";
import { useMemo } from "react";

import { useParams } from "react-router-dom";

const TripDetails = () => {
  const { getTripDetails } = useTripConfig();
  const { tripid } = useParams();
  const trip = getTripDetails(tripid);
  console.log("Trip Details", trip);
  const { GroupedTripExpenses } = useTransactionConfig();
  const tripExpenses = useMemo(() => {
    if (!GroupedTripExpenses.length) return [];
    return GroupedTripExpenses.find((t) => t.tripID === tripid)?.expenses || [];
  }, [GroupedTripExpenses, tripid]);

  return (
    <Flexcol>
      <Flexrow className={"rounded-lg"}>
        <div className="text-dark-a0 flex max-h-full min-h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>
        <div className="flex flex-col justify-center">
          {/*  <MonthCalander isExpense list={ExpenseList ?? []} /> */}
          <span className="font-para2-b text-20px">{trip.tripSummary}</span>
        </div>
      </Flexrow>

      {tripExpenses.length ? (
        <TransactionListTable isExpesne entries={tripExpenses} />
      ) : (
        <TripExpenseForm id={tripid} />
      )}
    </Flexcol>
  );
};

export default TripDetails;
