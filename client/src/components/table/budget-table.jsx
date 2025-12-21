import { Icons } from "../icons";
import { amountInteger } from "../utilityFilter";
import Flexrow from "../section/flexrow";

import TH from "./TH";
import TD from "./TD";
import { cardBgv2 } from "@/global/style";
import { cn } from "@/lib/utils";
import { getMonthName } from "@/utilities/calander-utility";
import useBudgetConfig from "@/hooks/useBudgetConfig";

const BudgetTable = ({ className }) => {
  const { BudgetList } = useBudgetConfig();
  const filteredList = BudgetList.filter((b) => b.amount > 0);
  return (
    <>
      <Flexrow className={cn("overflow-hidden font-para2-m", cardBgv2, className,"bg-dark-a1.2")}>
        <table className="w-full">
          <thead>
            <tr className="bg-dark-a5 text-slate-a1">
              <TH className="w-0 px-5">
                <Icons.checkCircle className={cn("text-14px text-bud-a1")} />
              </TH>
              <TH className="pr-5">Budget</TH>
              <TH className="pr-5">Year</TH>
              <TH className="pr-5">Month</TH>
            </tr>
          </thead>
          <tbody className="text-slate-a3 font-para2-m border-0">
            {filteredList.map((item, indx) => (
              <tr className={cn("text-14px ")} key={indx}>
                <TD className="px-5">
                  <Icons.checkCircle className={cn("text-14px text-bud-a1")} />
                </TD>
                <TD className="">
                  <Flexrow className="items-center !gap-1">
                    <Icons.rupee />
                    {amountInteger(item.amount)}
                    <span>/-</span>
                  </Flexrow>
                </TD>
                <TD className="">
                  <span>{item.year}</span>
                </TD>
                <TD className="">
                  <span>{getMonthName(item.month, "MMMM")}</span>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Flexrow>
    </>
  );
};

export default BudgetTable;
