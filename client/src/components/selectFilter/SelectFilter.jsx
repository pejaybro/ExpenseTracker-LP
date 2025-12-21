import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseCategories } from "@/global/categories";
import { cn } from "@/lib/utils";
import moment from "moment";

const SelectFilter = ({
  list,
  isChart,
  placeholder,
  onValueChange,
  className,
  triggerClass,
  contentClass,
  itemClass,
  isMonth,
  value,
  style,
}) => {
  return (
    <>
      <Select value={String(value)} onValueChange={onValueChange}>
        <SelectTrigger
          style={style}
          className={cn(
            "bg-dark-a3 !text-12px text-slate-a1 data-[placeholder]:text-slate-1 [&_svg:not([class*='text-'])]:text-slate-1 font-para2-m min-w-50 rounded-sm border-0 focus-visible:ring-[0px] data-[size=default]:h-7 [&_svg]:opacity-100",
            className,
            triggerClass,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "bg-dark-a3 shadow-dark-p2 min-w-45 border-0",
            contentClass,
          )}
        >
          {isChart &&
            list.map((item) => (
              <SelectItem
                key={item.id}
                value={item.primeName}
                className={cn(
                  "bg-dark-a3 !text-slate-1 text-12px data-[highlighted]:bg-dark-a6 flex-inline font-para2-m mb-1 gap-2",
                  itemClass,
                )}
              >
                <span
                  className="flex h-3 w-3 shrink-0 rounded-xs"
                  style={{
                    backgroundColor: expenseCategories.find(
                      (e) => e.title === item.primeName,
                    )?.color,
                  }}
                />
                {item.primeName}
              </SelectItem>
            ))}
          {!isChart &&
            list.map((items, index) => (
              <SelectItem
                className={cn(
                  "bg-dark-a3 !text-slate-1 text-12px data-[highlighted]:bg-dark-a5 flex-inline font-para2-m mb-1 gap-2",
                  itemClass,
                )}
                key={index}
                value={String(items)}
              >
                {isMonth ? moment().month(items).format("MMM") : items}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectFilter;
