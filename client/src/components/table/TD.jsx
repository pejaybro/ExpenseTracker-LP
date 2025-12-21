import { cn } from "@/lib/utils";
import React from "react";
const TD = ({ children, className = "", ...props }) => {
  return (
    <td
      {...props}
      className={cn(
        `text-14px h-max border-dark-a5 border-b px-1.5 py-2.5`,
        className,
      )}
    >
      {children}
    </td>
  );
};
export default TD;
