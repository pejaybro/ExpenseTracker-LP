import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import Flexrow from "../section/flexrow";

const SelectCard = ({
  title,
  children,  
  titleClass,
  className,
}) => {
  return (
    <>
      <Flexrow
        className={cn("!text-14px font-para2-m items-center gap-2", className)}
      >
        {title && <span className={cn("w-max",titleClass)}>{title}</span>}
        {children}
      </Flexrow>
    </>
  );
};

export default SelectCard;
