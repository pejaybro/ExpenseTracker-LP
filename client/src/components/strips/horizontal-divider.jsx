import { cn } from "@/lib/utils";

const HorizontalDivider = ({ className }) => {
  return (
    <div
      className={cn("bg-slate-a4 flex h-[01px] w-full rounded-full", className)}
    />
  );
};

export default HorizontalDivider;
