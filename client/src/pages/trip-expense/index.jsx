// --- React Core ---
import { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- 3rd Party Libraries ---
import moment from "moment";

// --- App Hooks ---
import useTripConfig from "@/hooks/useTripConfig";

// --- App Components ---
import CreateTripForm from "@/components/Forms/create-trip-form";
import ExpButton from "@/components/buttons/exp-button";
import { Icons } from "@/components/icons";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import SectionTitle from "@/components/section/section-title";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- App Utilities ---
import { bgDarkA3, cardBg } from "@/global/style";
import { cn } from "@/lib/utils";
import { PATH } from "@/router/routerConfig";
import { Spinner } from "flowbite-react";
import { GraphTitleSquare } from "@/components/analysis/linear-graph-data";
import TooltipStrip from "@/components/strips/tooltip-strip";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { deleteTrip } from "@/redux/slices/trip-slice";
import { amountFloat } from "@/components/utilityFilter";

const TripIndex = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const {
    TripList,
    TripLoading,
    TripError,
    AllTripSummary,
    FilteredTripSummary,
  } = useTripConfig();

  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  // --- Memoize Pagination Calculations ---
  const totalPages = useMemo(
    () => Math.ceil(TripList.length / ITEMS_PER_PAGE),
    [TripList],
  );
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return TripList.slice(start, end);
  }, [TripList, page]);

  // --- Memoize Click Handlers ---
  const handlePreviousPage = useCallback(() => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  }, [totalPages]);
  const dispatch = useDispatch();

  // NOTE: 1. Handle the loading state first
  if (TripLoading) {
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
  if (TripError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {TripError}
        </Flexrow>
      </>
    );
  }

  //NOTE: 3. Handle the "no data" state
  if (!TripList || TripList.length === 0) {
    // This gives the user a clear message if there's nothing to show
    return (
      <Flexcol className="m-auto max-w-[700px]">
        <div className="text-dark-a0 flex h-[250px] w-[700px] items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>

        <CreateTripForm />
      </Flexcol>
    );
  }

  // NOTE: 4. If all checks pass, render the main content

  return (
    <>
      <Flexcol className="gap-8">
        {/** ====== Top Section ====== */}
        <Flexcol className="m-auto max-w-[700px]">
          <div className="text-dark-a0 flex h-[250px] w-[700px] items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>

          <CreateTripForm />
        </Flexcol>

        {/** ====== Title for Trips ====== */}

        <SectionTitle title="Your Adventure's Log" />

        {/** ====== Trip Cards ====== */}

        <Flexrow className={"flex-wrap justify-center gap-5"}>
          {currentPageItems.map((trip) => (
            <Flexcol
              key={trip._id}
              className={cn(
                "justify-between gap-3.5 p-5 shadow-md lg:flex-1 lg:basis-[350px]",
                cardBg,
              )}
            >
              {/** ====== spent and travel destination  ====== */}
              <Flexrow className={"text-12px font-para2-m items-center"}>
                <Flexrow className={"items-center gap-1"}>
                  <span> Spent : </span>
                  <Icons.rupee className={"text-trip-a2"} />
                  <span>{amountFloat(trip.tripTotal)}</span>
                </Flexrow>
                <Flexrow className={"items-center justify-end gap-1.5"}>
                  {trip.tripType === 0 ? (
                    <Icons.trip_domestic className={"text-trip-a2"} />
                  ) : (
                    <Icons.trip_abroad className={"text-trip-a2"} />
                  )}
                  {trip.tripType === 0 ? "Domestic" : "Abroad"}
                </Flexrow>
              </Flexrow>

              {/** ====== Trip title  ====== */}
              <Flexrow
                className={
                  "text-22px font-para2-m cursor-default items-center gap-2 py-2.5"
                }
              >
                <Icons.trip className={"text-trip-a2"} />
                <span>{truncate(trip.tripTitle)}</span>
              </Flexrow>

              <Flexrow>
                {/** ====== Duration Dates ====== */}
                <Flexcol className="text-12px font-para2-m justify-center gap-1">
                  <Flexrow className="items-center gap-2">
                    <Icons.calander_date className={"text-trip-a2"} />
                    <span> From : </span>
                    <span> {moment(trip.startOn).format("DD MMM, YYYY")}</span>
                  </Flexrow>
                  <Flexrow className="items-center gap-2">
                    <Icons.calander_date className={"text-trip-a2"} />
                    <span> To : </span>
                    <span> {moment(trip.endsOn).format("DD MMM, YYYY")}</span>
                  </Flexrow>
                </Flexcol>

                {/** ====== Buttons ====== */}
                <Flexrow className={"w-max items-center justify-end gap-2"}>
                  {/** ====== Add Trip Expense : Btn ====== */}
                  <ExpButton
                    className={"bg-trip-a3 text-dark-a2 !text-18px"}
                    custom_iconbtn
                    custom_toolContent={"Add Trip Expense"}
                    onClick={() =>
                      navigate(`${trip._id}/${PATH.addTripExpense}`, {
                        state: { from: location },
                      })
                    }
                  >
                    <Icons.add_list />
                  </ExpButton>
                  {/** ====== View : Btn ====== */}
                  <ExpButton
                    className={"bg-trip-a3 text-dark-a2 !text-18px"}
                    custom_iconbtn
                    custom_toolContent={"View Trip"}
                    onClick={() => navigate(trip._id)}
                  >
                    <Icons.view />
                  </ExpButton>
                  {/** ====== Delete : Btn ====== */}
                  <TooltipStrip content="Delete Trip">
                    <ExpButton
                      delete_iconbtn
                      onClick={() => deleteToast(dispatch, trip._id)}
                      className={"bg-error-a1 text-slate-a1 !text-18px"}
                    />
                  </TooltipStrip>
                </Flexrow>
              </Flexrow>
            </Flexcol>
          ))}
        </Flexrow>

        {/** ====== Bottom Pagination ====== */}
        <Pagination className="py-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={
                  page === 1
                    ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                    : `bg-trip-a3 text-dark-a2 cursor-pointer`
                }
              >
                <Icons.pageBack />
              </PaginationPrevious>
            </PaginationItem>

            <PaginationItem className="px-2 text-sm">
              Page {page} of {totalPages}
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={
                  page === totalPages
                    ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                    : `bg-trip-a3 text-dark-a2 cursor-pointer`
                }
              >
                <Icons.pageNext />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Flexcol>
    </>
  );
};

export default TripIndex;

const truncate = (str) => (str.length > 24 ? str.slice(0, 24) + "..." : str);

export const deleteToast = (dispatch, ID, userID = 123456) => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <Flexrow
        className={cn(
          "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
        )}
      >
        <Flexcol className="flex-1 gap-0">
          <span className="font-para2-m">Delete Trip ?</span>
          <span>Do you want to delete ?</span>
        </Flexcol>

        <Flexrow className="w-max justify-end gap-2">
          <ExpButton
            custom_textbtn
            className="bg-ggbg"
            onClick={async () => {
              try {
                const { trip, count } = await dispatch(
                  deleteTrip({ tripId: ID, userID }),
                ).unwrap();

                toast.dismiss(t.id);
                toast.success("Trip Deleted !", {
                  description: `Name : ${trip.tripTitle} wtih [${count}] Expenses of Amount : ${amountFloat(trip.ofAmount)} `,
                  style: {
                    width: "24rem", // custom width
                  },
                });
                resolve(true);
              } catch (error) {
                toast.error("Operation Failed !", {
                  description: error,
                  style: {
                    width: "24rem", // custom width
                  },
                });
                resolve(false);
              }
            }}
          >
            Yes
          </ExpButton>
          <ExpButton
            custom_textbtn
            className="bg-rrbg"
            onClick={() => {
              toast.dismiss(t.id);
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
