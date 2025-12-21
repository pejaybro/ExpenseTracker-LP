import { Icons } from "../icons";
import { amountFloat } from "../utilityFilter";
import { cn } from "@/lib/utils";
import { cardBg } from "@/global/style";
import Flexcol from "../section/flexcol";
import Flexrow from "../section/flexrow";

const TotalCard = ({ date, total, footerText, headText, color, className }) => {
  return (
    <>
      <Flexcol
        className={cn(
          "min-h-[10rem]  justify-normal gap-2 p-5 text-[14px]",
          cardBg,
          className,
        )}
      >
        {/** ===== top section ===== */}
        <Flexrow className="font-para2-m justify-between">
          <Flexrow className="w-max items-center gap-2">
            <Icons.upbar className={cn(color)} />
            {headText}
          </Flexrow>
          <Flexrow className="w-max items-center justify-end gap-2">
            <Icons.yearCal className={cn(color)} />
            {date}
          </Flexrow>
        </Flexrow>
        {/** ===== middle section ===== */}
        <Flexrow className="text-32px font-para2-bb items-center gap-0.5">
          <Icons.rupee />
          {amountFloat(total)}
        </Flexrow>
        {/** ===== bottom section ===== */}
        <Flexrow className={"font-para2-r py-1"}>{footerText}</Flexrow>
      </Flexcol>
    </>
  );
};

export default TotalCard;
