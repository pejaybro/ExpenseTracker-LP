import { cn } from "@/lib/utils";
import Flexrow from "./flexrow";
import HorizontalDivider from "../strips/horizontal-divider";

const SectionTitle = ({ title, className }) => {
  return (
    <>
      <Flexrow
        className={cn(
          "font-title items-center gap-2.5 text-[32px] tracking-wide",
          className,
        )}
      >
        {title && <span>{title}</span>}
        <HorizontalDivider className={"h-[2px] flex-1"} />
      </Flexrow>
    </>
  );
};

export default SectionTitle;
