import ExpButton from "@/components/buttons/exp-button";
import TripExpenseForm from "@/components/Forms/trip-expense-form";
import { Icons } from "@/components/icons";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import TransactionListTable from "@/components/table/transaction-list-table";
import { TravelType, TripType } from "@/global/globalVariables";
import useTransactionConfig from "@/hooks/useTransactionConfig";
import { cn } from "@/lib/utils";
import { getDate } from "@/utilities/calander-utility";
import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { deleteToast } from ".";
import { useDispatch } from "react-redux";
import { PATH } from "@/router/routerConfig";
import EditTripForm from "@/components/Forms/edit-trip-form";
import { amountFloat } from "@/components/utilityFilter";
import { apiCLient } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import SectionTitle from "@/components/section/section-title";
import HorizontalDivider from "@/components/strips/horizontal-divider";
const style = "!text-12px bg-slate-a2 text-dark-a3 px-3 w-max font-para2-b";

const TripDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tripid } = useParams();
  const {
    data: trip,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["trip", tripid],
    queryFn: () => fetchTripById(tripid),
    enabled: !!tripid, // 🚨 important
    staleTime: Infinity, // never auto-refetch
    refetchOnMount: "always",
  });

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

  if (isLoading || isFetching) {
    return (
      <Flexrow className="h-full items-center justify-center">
        <Spinner
          className="text-slate-a3 fill-trip-a1"
          size="lg"
          aria-label="expense page loader"
        />
      </Flexrow>
    );
  }

  if (isError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {error.message}
        </Flexrow>
      </>
    );
  }

  return (
    <Flexcol className="gap-8">
      {/** ====== Trip Title & delete btn ====== */}

      <Flexrow className={"justify-between"}>
        <div className="text-24px font-title inline-flex w-max items-baseline gap-2 tracking-wide">
          {trip?.tripType === TripType.abroad ? (
            <Icons.trip_abroad className="text-20px" />
          ) : (
            <Icons.trip_domestic className="text-20px" />
          )}
          <span className="flex-1">{trip?.tripTitle} </span>
        </div>
        <ExpButton
          custom_iconbtn
          custom_toolContent={"Delete Trip"}
          onClick={() =>
            deleteToast(dispatch, trip?._id).then((success) => {
              if (success) navigate(PATH.trip);
            })
          }
          className={cn(style, "bg-error-a1 text-slate-a1")}
        >
          <Icons.delete_bin />
        </ExpButton>
      </Flexrow>
      <HorizontalDivider className={"h-[2px]"} />
      {/** ====== Trip Card ====== */}
      <Flexrow className={"h-full flex-wrap items-stretch gap-0 rounded-lg"}>
        <div className="text-dark-a0 flex w-[250px] max-w-[350px] items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>
        <Flexcol className="flex-1 justify-center p-5">
          {/** ====== Top ====== */}
          <Flexrow className={"flex-wrap"}>
            {/** ====== Top : start & end Dates ====== */}
            <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
              <Icons.dayCal />
              Duration :<span>{getDate(trip?.startOn)}</span>
              {days >= 1 && (
                <>
                  <span>-</span>
                  <span>{getDate(trip?.endsOn)}</span>
                </>
              )}
            </ExpButton>
            {/** ====== Top : days duration ====== */}
            <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
              {days === 0 && <span>1 Day</span>}
              {days === 1 && <span>Overnight Stay</span>}
              {days > 1 && (
                <>
                  {days}
                  <span>Days</span>
                </>
              )}
            </ExpButton>
          </Flexrow>
          {/** ====== Middle : Trip AI Summary ====== */}
          <span className="font-comic-r text-18px py-5">
            {trip?.tripSummary}
          </span>
          {/** ====== Bottom ====== */}
          <Flexrow className={"flex-wrap"}>
            {/** ====== Bottom : destination ====== */}
            <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
              <Icons.location />
              {trip?.tripType === TripType.domestic && "Domestic"}
              {trip?.tripType === TripType.abroad && trip?.abroadInfo && (
                <span>{trip?.abroadInfo?.country}</span>
              )}
            </ExpButton>
            {/** ====== Bottom : traveling type ====== */}
            <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
              <Icons.people_group />
              Traveling
              <span>
                {trip?.travelType === TravelType.solo && "Solo"}
                {trip?.travelType === TravelType.family && "with Family"}
                {trip?.travelType === TravelType.group &&
                  `in a group of ${trip?.ofGroup}`}
                {trip?.travelType === TravelType.famGroup &&
                  `in Family Group of ${trip?.ofGroup}`}
              </span>
            </ExpButton>
          </Flexrow>
        </Flexcol>
      </Flexrow>
      {/** ====== Buttons ====== */}
      <Flexrow className={"flex-wrap gap-2.5 rounded-sm"}>
        <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
          <Icons.money />
          Spent :<span>{amountFloat(trip?.tripTotal)}</span>
          <span>
            {trip?.tripType === TripType.abroad
              ? trip?.abroadInfo?.currencyCode
              : "INR"}
          </span>
        </ExpButton>

        {trip?.tripType === TripType.abroad && trip?.abroadInfo && (
          <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
            <Icons.dayCal />
            In INR :
            <span>{amountFloat(trip?.tripTotal * trip?.abroadInfo?.rate)}</span>
          </ExpButton>
        )}

        <ExpButton
          custom_textbtn
          onClick={() => setEditingTripDetails(trip)}
          className={cn(style, "flex-1", "bg-trip-a3")}
        >
          Edit Trip
        </ExpButton>
        {tripExpenses.length > 0 && (
          <ExpButton
            custom_textbtn
            onClick={() => setShowForm(!showForm)}
            className={cn(
              style,
              "cursor-default",
              "bg-trip-a3 flex-1",
              showForm && "bg-error-a1 text-slate-a1",
            )}
          >
            {showForm ? "Close Form" : "Add Trip Expense"}
          </ExpButton>
        )}
      </Flexrow>
      {/** ====== Trip Expense Form ====== */}
      {showForm && <TripExpenseForm hasTripExpense={false} id={tripid} />}
      {/** ====== Trip Expenses List ====== */}
      <SectionTitle title="Trip Expenses" />
      {tripExpenses.length > 0 && (
        <TransactionListTable isExpesne entries={tripExpenses} />
      )}
      {/** ====== Trip Edit Form ====== */}
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

export const fetchTripById = async (tripId) => {
  if (!tripId) throw new Error("Trip ID missing");
  const res = await apiCLient.get(`/trip/get-trip-details/${tripId}`);
  return res.data;
};
