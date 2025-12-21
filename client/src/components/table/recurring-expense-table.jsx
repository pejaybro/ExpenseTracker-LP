import moment from "moment";
import { useState } from "react";

//Shacdn-UI

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getPrimeColor } from "@/global/categories";

import TooltipStrip from "../strips/tooltip-strip";
import Flexrow from "../section/flexrow";
import IconCircle from "../IconCircle";
import Flexcol from "../section/flexcol";
import { amountFloat } from "../utilityFilter";
import { Icons } from "../icons";

import { cardBg } from "@/global/style";
import { cn } from "@/lib/utils";
import ExpButton from "../buttons/exp-button";
import TransactionEditForm from "../Forms/transaction-edit-form";
import { deleteRecurringExpense } from "@/redux/slices/transaction-slice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

const RecurringExpenseTable = ({ entries }) => {
  //Pagination
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentPageItems = entries.slice(start, end);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  //const emptyRows = ITEMS_PER_PAGE - currentPageItems.length;
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const dispatch = useDispatch();

  const deleteToast = (ID, userID = 123456) => {
    return new Promise((resolve) => {
      toast.custom((t) => (
        <Flexrow
          className={cn(
            "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
          )}
        >
          <Flexcol className="flex-1 gap-0">
            <span className="font-para2-m">Delete Recurring Expense ?</span>
            <span>Do you want to delete ?</span>
          </Flexcol>

          <Flexrow className="w-max justify-end gap-2">
            <ExpButton
              custom_textbtn
              className="bg-ggbg"
              onClick={async () => {
                try {
                  const result = await dispatch(
                    deleteRecurringExpense({ recExpID: ID, userID }),
                  ).unwrap();
                  toast.dismiss(t.id);
                  toast.success("Recurring Entry Deleted !", {
                    description: `Amount : ${result.ofAmount} | Category : ${result.subCategory},${result.primeCategory}`,
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

  return (
    <>
      <Flexcol className="cursor-default">
        {currentPageItems.map((data) => (
          <TooltipStrip
          fill={"bg-rep-a3 fill-rep-a3 "}
          className={"bg-rep-a3"}
            key={data._id}
            content={data.isNote ? data.isNote : "No Transaction Note Given"}
          >
            <div className={cn("flex w-full gap-5 px-5 py-2.5", cardBg)}>
              <Flexrow className="w-max items-center">
                <IconCircle
                  className={"!text-24px rounded-lg"}
                  bgColor={data.primeCategory}
                  setIcon={data.subCategory}
                />
              </Flexrow>
              <Flexcol className="gap-0.5">
                <div className="text-22px font-para2-b">{data.subCategory}</div>
                <Flexrow className="text-12px font-para2-r w-max gap-2.5">
                  <Flexrow className={"w-max items-center gap-1.25"}>
                    <span
                      className="size-3 rounded-xs"
                      style={{
                        backgroundColor: getPrimeColor(data.primeCategory),
                      }}
                    ></span>
                    {data.primeCategory}
                  </Flexrow>
                  <Flexrow className={"w-max items-center gap-1.25"}>
                    <Icons.repeat />
                    Billed
                    <span>
                      {data.isReccuringBy == 1 && "Monthly"}
                      {data.isReccuringBy == 2 && "Yearly"}
                    </span>
                  </Flexrow>

                  <Flexrow className={"w-max items-center gap-1.25"}>
                    <Icons.dayCal />
                    Created
                    <span> {moment(data.onDate).format("DD MMM, YYYY")}</span>
                  </Flexrow>
                </Flexrow>
              </Flexcol>
              <Flexrow className="text-28px font-para2-bb w-max items-center gap-1.25 pl-2">
                <Icons.rupee className="text-18px" />
                {amountFloat(data.ofAmount)}
              </Flexrow>
              <Flexrow className="w-max items-center gap-2.5">
                <TooltipStrip content="Edit Record">
                  <ExpButton
                    edit_iconbtn
                    onClick={() => setSelectedTransaction(data)}
                    className={cn("text-slate-a1 bg-rep-a1")}
                  />
                </TooltipStrip>

                <TooltipStrip content="Delete Record">
                  <ExpButton
                    delete_iconbtn
                    className={"bg-error-a1 text-slate-a1"}
                    onClick={() => deleteToast(data._id)}
                  />
                </TooltipStrip>
              </Flexrow>
            </div>
          </TooltipStrip>
        ))}
      </Flexcol>

      <TransactionEditForm
        transaction={selectedTransaction}
        isRecurring
        setSelectedTransaction={setSelectedTransaction}
      />

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={
                page === 1
                  ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                  : `bg-rep-a1 cursor-pointer`
              }
            >
              <Icons.pageBack />
            </PaginationPrevious>
          </PaginationItem>

          <PaginationItem className="text-14px px-5">
            Page {page} of {totalPages}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={
                page === totalPages
                  ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                  : `bg-rep-a1 cursor-pointer`
              }
            >
              <Icons.pageNext />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default RecurringExpenseTable;
