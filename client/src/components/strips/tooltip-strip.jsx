import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TooltipStrip = ({
  children,
  fill,
  content = "Tooltip Text",
  className,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent
        side="top"
        fill={fill}
        sideOffset={6}
        className={cn(
          "bg-slate-a1 text-14px text-dark-a2 font-para2-b rounded-md px-2 py-1 shadow-md",
          className,
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipStrip;
