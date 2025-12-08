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
import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { deleteToast } from ".";
import TooltipStrip from "@/components/strips/tooltip-strip";
import { useDispatch } from "react-redux";
import { PATH } from "@/router/routerConfig";
import EditTripForm from "@/components/Forms/edit-trip-form";
const style = "!text-12px bg-trip-a3 text-dark-a3 px-3 w-max font-para2-b";

const TripDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getTripDetails } = useTripConfig();
  const { tripid } = useParams();
  const trip = getTripDetails(tripid);

  const { GroupedTripExpenses } = useTransactionConfig();

  const tripExpenses = useMemo(
    () => GroupedTripExpenses.find((t) => t.tripID === tripid)?.expenses || [],
    [GroupedTripExpenses, tripid],
  );

  const [showForm, setShowForm] = useState(true);
  useEffect(() => {
    if (tripExpenses.length > 0) {
      setShowForm(false);
    }
    if (!tripExpenses.length) {
      setShowForm(true);
    }
  }, [tripExpenses.length]);

 

  const days = getDurationCategory(trip?.startOn, trip?.endsOn);

  const [editingTripDetails, setEditingTripDetails] = useState(null);

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
          Duraction :<span>{getDate(trip?.startOn)}</span>
          {days >= 1 && (
            <>
              <span>-</span>
              <span>{getDate(trip?.endsOn)}</span>
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
          {trip?.tripType === TripType.domestic && "Domestic"}
          {trip?.tripType === TripType.abroad && trip?.abroadInfo && (
            <span>{trip?.abroadInfo?.country}</span>
          )}
        </ExpButton>
        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          Traveling
          <span>
            {trip?.travelType === TravelType.solo && "Solo"}
            {trip?.travelType === TravelType.family && "with Family"}
            {trip?.travelType === TravelType.group && "in Group"}
            {trip?.travelType === TravelType.famGroup && "in Family Group"}
          </span>
          {trip?.ofGroup > 1 && (
            <>
              <span>of</span>
              <span>{trip?.ofGroup}</span>
            </>
          )}
        </ExpButton>

        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.dayCal />
          Spent :<span>{trip?.tripTotal}</span>
          <span>
            {trip?.tripType === TripType.abroad
              ? trip?.abroadInfo?.currencyCode
              : "INR"}
          </span>
        </ExpButton>

        <ExpButton
          custom_textbtn
          custom_toolContent={"Delete Trip"}
          onClick={() =>
            deleteToast(dispatch, trip?._id).then((success) => {
              if (success) navigate(PATH.trip);
            })
          }
          className={cn(style, "bg-error-a1 text-slate-a1 cursor-default")}
        >
          Delete Trip
        </ExpButton>
        <ExpButton
          custom_textbtn
          onClick={() => setEditingTripDetails(trip)}
          className={cn(style, "cursor-default")}
        >
          Edit Trip
        </ExpButton>

        {trip?.tripType === TripType.abroad && trip?.abroadInfo && (
          <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
            <Icons.dayCal />
            In INR :<span>{trip?.tripTotal * trip?.abroadInfo?.rate}</span>
          </ExpButton>
        )}
      </Flexrow>
      {tripExpenses.length > 0 && (
        <Flexrow>
          <ExpButton
            custom_textbtn
            onClick={() => setShowForm(!showForm)}
            className={cn(style, "cursor-default", "w-full")}
          >
            {showForm ? "Close Form" : "Add Trip Expense"}
          </ExpButton>
        </Flexrow>
      )}
      {showForm && (
        <Flexrow>
          <div className="text-dark-a0 flex max-h-full min-h-[200px] max-w-[350px] min-w-[350px] flex-1 items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
          <TripExpenseForm hasTripExpense={false} id={tripid} />
        </Flexrow>
      )}

      {tripExpenses.length > 0 && (
        <TransactionListTable isExpesne entries={tripExpenses} />
      )}
      <EditTripForm
        tripDetails={editingTripDetails}
        setEditingTripDetails={setEditingTripDetails}
        onClose={() => setEditingTripDetails(null)}
      />
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
