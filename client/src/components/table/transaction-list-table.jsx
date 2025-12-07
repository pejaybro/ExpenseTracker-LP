import moment from "moment";
import { useEffect, useMemo, useState } from "react";

//Shacdn-UI

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import IconCircle from "@/components/IconCircle";

import Flexrow from "@/components/section/flexrow";
import { Icons } from "@/components/icons";
import TooltipStrip from "@/components/strips/tooltip-strip";

import Flexcol from "@/components/section/flexcol";
import { amountFloat } from "@/components/utilityFilter";
import {
  expenseCategories,
  getPrimeCategories,
  getPrimeColor,
  getSubOfPrime,
  incomeCategories,
} from "@/global/categories";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { deleteExpense, deleteIncome } from "@/redux/slices/transaction-slice";
import { cardBg } from "@/global/style";
import ExpButton from "../buttons/exp-button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { ErrorField, FieldLabel, FormField, SelectDate } from "../Forms/Form";
import SelectFilter from "../selectFilter/SelectFilter";
import TransactionEditForm from "../Forms/transaction-edit-form";

const TransactionListTable = ({ isRecent, isExpesne, isIncome, entries }) => {
  //Pagination
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentPageItems = entries.slice(start, end);
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  //const emptyRows = ITEMS_PER_PAGE - currentPageItems.length;

  const bgColor = (isExpesne && "bg-exp-a3") || (isIncome && "bg-inc-a2");

  const dispatch = useDispatch();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const deleteToast = (ID, userID = 123456) => {
    return new Promise((resolve) => {
      toast.custom((t) => (
        <Flexrow
          className={cn(
            "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
          )}
        >
          <Flexcol className="flex-1 gap-0">
            <span className="font-medium">Delete Expense ?</span>
            <span>Do you want to delete ?</span>
          </Flexcol>

          <Flexrow className="w-max justify-end gap-2">
            <ExpButton
              custom_textbtn
              className="bg-ggbg"
              onClick={async () => {
                try {
                  const result =
                    (isExpesne &&
                      (await dispatch(
                        deleteExpense({ expID: ID, userID }),
                      ).unwrap())) ||
                    (isIncome &&
                      (await dispatch(
                        deleteIncome({ incID: ID, userID }),
                      ).unwrap()));
                  toast.dismiss(t.id);
                  toast.success("Transaction Deleted !", {
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
            key={data._id}
            content={data.isNote ? data.isNote : "No Transaction Note Given"}
          >
            {/** ======== main rectangle box ======== */}
            <Flexrow className={cn("px-5 py-2.5", cardBg)}>
              <Flexrow className="w-max items-center">
                <IconCircle
                  bgColor={data.primeCategory}
                  setIcon={data.subCategory}
                />
              </Flexrow>
              <Flexcol className="gap-0.5">
                <p className="text-22px font-para2-b">{data.subCategory}</p>
                <Flexrow className="text-12.5 font-para2-r w-max gap-2.5">
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
                    <Icons.dayCal />
                    {moment(data.onDate).format("Do MMM, yyyy")}
                  </Flexrow>
                  <Flexrow className={"w-max items-center gap-1.25"}>
                    {data.isTripExpense && (
                      <>
                        <Icons.trip />
                        {"Trip Expense"}
                      </>
                    )}
                    {data.isReccuringExpense && (
                      <>
                        <Icons.repeat />
                        {"Reccuring Expense"}
                      </>
                    )}
                  </Flexrow>
                </Flexrow>
              </Flexcol>
              <Flexrow className="text-28px font-para2-bb w-max items-center gap-1.25">
                <Icons.rupee className="text-18px" />
                {amountFloat(data.ofAmount)}
              </Flexrow>
              <Flexrow className="w-max items-center gap-2.5">
                <TooltipStrip content="Edit Record">
                  <ExpButton
                    edit_iconbtn
                    onClick={() => setSelectedTransaction(data)}
                    className={cn(
                      "text-slate-a1",
                      (isExpesne && "bg-exp-aa") || (isIncome && "bg-inc-a0"),
                    )}
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
            </Flexrow>
          </TooltipStrip>
        ))}
      </Flexcol>

      <TransactionEditForm
        transaction={selectedTransaction}
        isExpesne={isExpesne}
        isIncome={isIncome}
        setSelectedTransaction={setSelectedTransaction}
      />

      {!isRecent && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={
                  page === 1
                    ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                    : `text-dark-a1 cursor-pointer ${bgColor}`
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
                    : `text-dark-a1 cursor-pointer ${bgColor}`
                }
              >
                <Icons.pageNext />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default TransactionListTable;

/** 
 * ? OLD CODE FOR TABLE
 * 
 * <tr className="hover:bg-gradBot">
                  <TD className="px-2.5">
                    <IconCircle
                      bgColor={data.primeCategory}
                      setIcon={data.subCategory}
                    />
                  </TD>
                  <TD className="font-medium">{data.subCategory}</TD>
                  <TD>
                    <button className="text-12px text-dim border-br2 rounded-sm border px-2 py-1.25 leading-none">
                      {data.primeCategory}
                    </button>
                  </TD>
                  <TD>
                    <Flexrow className="text-12px text-dim items-center !gap-1.5">
                      <Icons.dayCal />
                      <span>{moment(data.onDate).format("DD/MM/yyyy")}</span>
                    </Flexrow>
                  </TD>

                  <TD className="text-center">
                    <TooltipStrip content="Trip Expense">
                      <ExpButton
                        btnfor="trip"
                        className="!p-1.5"
                        label={<Icons.trip />}
                      />
                    </TooltipStrip>
                  </TD>
                  <TD>
                    <Flexrow className="items-center justify-end !gap-1.5 font-medium">
                      <Icons.rupee /> <span>{data.ofAmount}</span>
                    </Flexrow>
                  </TD>
                  <TD>
                    <Flexrow className="justify-center !gap-2">
                      <TooltipStrip content="Edit Record">
                        <ExpButton
                          btnfor="trip"
                          className="!p-1.5"
                          label={<Icons.pencil />}
                        />
                      </TooltipStrip>
                      <TooltipStrip content="View Record">
                        <ExpButton
                          btnfor="trip"
                          className="!p-1.5"
                          label={<Icons.view />}
                        />
                      </TooltipStrip>
                      <TooltipStrip content="Delete Record">
                        <ExpButton
                          btnfor="trip"
                          className="!p-1.5"
                          label={<Icons.del />}
                        />
                      </TooltipStrip>
                    </Flexrow>
                  </TD>
                </tr>
 */
