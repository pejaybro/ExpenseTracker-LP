import React, { useState } from "react";

import { amountFloat, amountSignedFloat } from "../utilityFilter";
import { Icons } from "../icons";
import Flexrow from "../section/flexrow";
import TH from "./TH";
import TD from "./TD";
import { cn } from "@/lib/utils";
import { cardBgv2 } from "@/global/style";
import { getMonthName } from "@/utilities/calander-utility";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export const ComboTable = ({ data, isBudgeting, isAnalysis }) => {
  const headderRow =
    (isBudgeting && (
      <>
        <TH className="pr-15">Month</TH>
        <TH className="pr-5">Budget</TH>
        <TH className="pr-5">Expense</TH>
        <TH className="pr-5">Difference</TH>
        <TH className="pr-5">%</TH>
      </>
    )) ||
    (isAnalysis && (
      <>
        <TH className="pr-15">Month</TH>
        <TH className="pr-5">Income</TH>
        <TH className="pr-5">Expense</TH>
        <TH className="pr-5">Difference</TH>
        <TH className="pr-5">%</TH>
      </>
    ));

  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(1);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentPageItems = data.slice(start, end);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const bgStyle = (isBudgeting && "bg-bud-a1") || (isAnalysis && "bg-exp-a1");
  const txtStyle =
    (isBudgeting && "text-bud-a1") || (isAnalysis && "text-exp-a1");
  return (
    <>
      <Flexrow className={cn("overflow-hidden font-para2-m", cardBgv2, "bg-dark-a1.2")}>
        <table className="w-full">
          <thead>
            <tr className="bg-dark-a5 text-slate-a1 ">
              <TH className="w-0 px-5">
                <Icons.checkCircle className={cn("text-14px", txtStyle)} />
              </TH>
              {headderRow}
              <TH className="px-5"> </TH>
            </tr>
          </thead>
          <tbody className="text-slate-a3 border-0">
            {currentPageItems.map((d) => (
              <tr
                className="text-14px"
                key={(isBudgeting && d.month) || (isAnalysis && d.indicator)}
              >
                <TD className="px-5">
                  <Icons.checkCircle className={cn("text-14px", txtStyle)} />
                </TD>
                <TD className="">
                  {(isBudgeting && getMonthName(d.month)) ||
                    (isAnalysis && d.indicator)}
                </TD>
                <TD className="">
                  {isBudgeting &&
                    (d.budget == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      amountFloat(d.budget)
                    ))}
                  {isAnalysis &&
                    (d.Income == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      amountFloat(d.Income)
                    ))}
                </TD>
                <TD className="">
                  {isBudgeting &&
                    (d.expense == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      amountFloat(d.expense)
                    ))}
                  {isAnalysis &&
                    (d.Expense == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      amountFloat(d.Expense)
                    ))}
                </TD>

                <TD className="">
                  {isBudgeting &&
                    (d.budget == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      <span
                        className={`${d.budget - d.expense < 0 ? "text-rr" : "text-gg"}`}
                      >
                        {amountSignedFloat(d.budget - d.expense)}
                      </span>
                    ))}
                  {isAnalysis &&
                    (d.Income == 0 ? (
                      <span className="text-slate-a7"> --/-- </span>
                    ) : (
                      <span
                        className={`${d.Income - d.Expense < 0 ? "text-rr" : "text-gg"}`}
                      >
                        {amountSignedFloat(d.Income - d.Expense)}
                      </span>
                    ))}
                </TD>

                <TD
                  className={`${d.percent < 0 && "text-gg"} ${d.percent > 0 && "text-rr"} `}
                >
                  {d.percent == 0 ? (
                    <span className="text-slate-a7"> --/-- </span>
                  ) : (
                    amountSignedFloat(d.percent) + "%"
                  )}
                </TD>
                <TD className={`${d.percent <= 0 ? "text-gg" : "text-rr"} `}>
                  <span className="text-12px">
                    {d.percent < 0 && <Icons.graphdown />}
                    {d.percent > 0 && <Icons.graphup />}
                  </span>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Flexrow>

      {isAnalysis && data.length > 15 && (
        <Flexrow>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={
                    page === 1
                      ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                      : `text-dark-a1 cursor-pointer ${bgStyle}`
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
                      : `text-dark-a1 cursor-pointer ${bgStyle}`
                  }
                >
                  <Icons.pageNext />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Flexrow>
      )}
    </>
  );
};
