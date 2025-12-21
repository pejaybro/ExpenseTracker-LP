import { cn } from "@/lib/utils";
import React from "react";
const TH = ({ children, className = "" }) => {
  return (
    <th
      className={cn(
        "text-14px font-para2-r px-1.5 py-2.5 text-left",
        className,
      )}
    >
      {children}
    </th>
  );
};

export default TH;
