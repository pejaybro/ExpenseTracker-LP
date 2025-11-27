import ExpButton from "@/components/buttons/exp-button";
import TripExpenseForm from "@/components/Forms/trip-expense-form";
import { Icons } from "@/components/icons";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import TransactionListTable from "@/components/table/transaction-list-table";
import { TravelType, TripType } from "@/global/globalVariables";
import useTransactionConfig from "@/hooks/useTransactionConfig";
import useTripConfig from "@/hooks/useTripConfig";
import { cn } from "@/lib/utils";
import { getDate } from "@/utilities/calander-utility";
import { useMemo } from "react";

import { useParams } from "react-router-dom";
const style = "!text-12px bg-trip-a3 text-dark-a3 px-3 w-max font-para2-b";

const TripDetails = () => {
  const { getTripDetails } = useTripConfig();
  const { tripid } = useParams();
  const trip = useMemo(() => getTripDetails(tripid), [tripid]);
  console.log("Trip Details", trip);
  const { GroupedTripExpenses } = useTransactionConfig();


  
  const tripExpenses = useMemo(() => {
    if (!GroupedTripExpenses.length) return [];
    return GroupedTripExpenses.find((t) => t.tripID === tripid)?.expenses || [];
  }, [GroupedTripExpenses, tripid]);



  const days = getDurationCategory(trip?.startOn, trip?.endsOn);

  return (
    <Flexcol>
      <Flexrow className={"bg-dark-a3 items-center rounded-lg"}>
        <div className="text-dark-a0 flex max-h-full min-h-[200px] max-w-[350px] min-w-[350px] flex-1 items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>
        <span className="font-para2-b text-20px">{trip?.tripSummary}</span>
      </Flexrow>

      <Flexrow className={"flex-wrap gap-2.5 rounded-sm"}>
        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          Duraction :<span>{getDate(trip.startOn)}</span>
          {days >= 1 && (
            <>
              <span>-</span>
              <span>{getDate(trip.endsOn)}</span>
            </>
          )}
        </ExpButton>
        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          {days === 0 && <span>For 1 Day</span>}
          {days === 1 && <span>For Overnight Stay</span>}
          {days > 1 && (
            <>
              <span>For</span>
              {days}
              <span>Days</span>
            </>
          )}
        </ExpButton>

        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          <span>Destination :</span>
          {trip.tripType === TripType.domestic && "Domestic"}
          {trip.tripType === TripType.abroad && trip.abroadInfo && (
            <span>{trip.abroadInfo?.country}</span>
          )}
        </ExpButton>
        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          Traveling
          <span>
            {trip.travelType === TravelType.solo && "Solo"}
            {trip.travelType === TravelType.family && "with Family"}
            {trip.travelType === TravelType.group && "in Group"}
            {trip.travelType === TravelType.famGroup && "in Family Group"}
          </span>
          {trip.ofGroup > 1 && (
            <>
              <span>of</span>
              <span>{trip.ofGroup}</span>
            </>
          )}
        </ExpButton>

        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          Spent :<span>{trip.tripTotal}</span>
          <span>
            {trip.tripType === TripType.abroad
              ? trip.abroadInfo?.currencyCode
              : "INR"}
          </span>
        </ExpButton>
        {trip.tripType === TripType.abroad && trip.abroadInfo && (
          <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
            <Icons.dayCal />
            In INR :<span>{trip.tripTotal * trip.abroadInfo?.rate}</span>
          </ExpButton>
        )}
      </Flexrow>

      {tripExpenses.length ? (
        <TransactionListTable isExpesne entries={tripExpenses} />
      ) : (
        <Flexrow>
          <div className="text-dark-a0 flex max-h-full min-h-[200px] max-w-[350px] min-w-[350px] flex-1 items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
          <TripExpenseForm
            hasTripExpense={!tripExpenses.length ? false : true}
            id={tripid}
          />
        </Flexrow>
      )}
    </Flexcol>
  );
};

export default TripDetails;

export const getDurationCategory = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  // Reset hours to ensure we only compare dates
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end - start;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days;
};
