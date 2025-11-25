// --- React Core ---
import { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- 3rd Party Libraries ---
import moment from "moment";

// --- App Hooks ---
import useTripConfig from "@/hooks/useTripConfig";

// --- App Components ---
import CreateTripForm from "@/components/Forms/Create-Trip-Form";
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

  console.log("Filtered Summary", FilteredTripSummary);
  console.log("All Summary", AllTripSummary);

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
    return <CreateTripForm />;
  }

  // NOTE: 4. If all checks pass, render the main content

  return (
    <>
      <Flexcol>
        <Flexrow className={"rounded-lg"}>
          <div className="text-dark-a0 flex max-h-full min-h-[200px] w-[350px] items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
          <div className="flex flex-1 flex-col justify-center">
            {/*  <MonthCalander isExpense list={ExpenseList ?? []} /> */}
            <CreateTripForm />
          </div>
        </Flexrow>
        <Flexrow className={cn("!text-14px mt-5 w-full gap-2.5")}>
          <span className="font-title text-[32px] tracking-wide">
            Your Amazing Adventures Catalog{" "}
          </span>
        </Flexrow>

        <Flexrow className={"flex-wrap justify-center gap-5"}>
          {currentPageItems.map((trip) => (
            <Flexcol
              key={trip._id}
              className={cn(
                "justify-between gap-3.5 p-5 shadow-md lg:flex-1 lg:basis-[350px]",
                cardBg,
              )}
            >
              <Flexrow className={"text-12px items-center font-medium"}>
                <Flexrow className={"items-center gap-1.5"}>
                  <GraphTitleSquare className={"bg-trip-a1 size-3"} />
                  <span> Expensed : </span>
                  <Icons.rupee className={"text-trip-a2"} />
                  <span>{5000}</span>
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
              <Flexrow
                className={"text-22px items-center gap-2 py-2.5 font-medium"}
              >
                <Icons.trip className={"text-trip-a2"} />
                <span>{truncate(trip.tripTitle)}</span>
              </Flexrow>

              <Flexrow>
                <Flexcol className="text-12px justify-center gap-1 font-medium">
                  <Flexrow className="items-center gap-2">
                    <Icons.calander_date className={"text-trip-a2"} />
                    <span> Started On : </span>
                    <span> {moment(trip.startOn).format("DD MMM, YYYY")}</span>
                  </Flexrow>
                  <Flexrow className="items-center gap-2">
                    <Icons.calander_date className={"text-trip-a2"} />
                    <span> Ended On : </span>
                    <span> {moment(trip.endsOn).format("DD MMM, YYYY")}</span>
                  </Flexrow>
                </Flexcol>

                <Flexrow className={"w-max items-center justify-end gap-2"}>
                  <ExpButton
                    className={"bg-trip-a3 text-dark-a2 !text-18px"}
                    custom_iconbtn
                    custom_toolContent={"View Trip"}
                    onClick={() => navigate(trip._id)}
                  >
                    <Icons.view />
                  </ExpButton>
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
                </Flexrow>
              </Flexrow>
            </Flexcol>
          ))}
        </Flexrow>
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
