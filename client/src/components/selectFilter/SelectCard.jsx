import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import Flexrow from "../section/flexrow";

const SelectCard = ({
  title,
  children,
  isExpense,
  isReccuring,
  isTrip,
  noIcon,
  titleClass,
  className,
}) => {
  return (
    <>
      <Flexrow
        className={cn("!text-14px font-para2-b items-center gap-2", className)}
      >
        {title && <span className={cn("w-max",titleClass)}>{title}</span>}
        {children}
      </Flexrow>
    </>
  );
};

export default SelectCard;
