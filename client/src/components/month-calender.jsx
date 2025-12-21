import moment from "moment";
import { Icons } from "./icons";
import { Separator } from "./ui/separator";
import Flexrow from "./section/flexrow";
import { cn } from "@/lib/utils";
import { cardBg } from "@/global/style";
import Flexcol from "./section/flexcol";

const MonthCalander = ({ isExpense, list }) => {
  const currentMonth = moment().month(); // current month index (0-11)
  const currentYear = moment().year();

  // Days of week (change "ddd" to "dddd" if you want full name)
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    moment().weekday(i).format("ddd"),
  );

  // Get first day of month & total days
  const firstDayOfMonth = moment([currentYear, currentMonth, 1]).day();
  const daysInMonthCount = moment([currentYear, currentMonth]).daysInMonth();

  // Fill calendar slots
  const daysInMonth = [
    ...Array(firstDayOfMonth).fill(null), // empty slots before start
    ...Array.from({ length: daysInMonthCount }, (_, i) => i + 1),
  ];

  return (
    <div className="!text-14px font-para2-m flex w-full max-w-[300px] shrink-0 flex-col">
      <Flexrow className="mb-4 items-center gap-2 rounded-md">
        <Icons.calander_date
          className={`${isExpense ? "text-exp-a1" : "text-inc-a2"} text-16px`}
        />
        {moment().format("MMMM, YYYY")}
        <Separator
          orientation="vertical"
          className="bg-slate-2 data-[orientation=vertical]:h-3"
        />
        {isExpense ? "Expense Dates" : "Income Dates"}
      </Flexrow>
      {/* Days Header */}
      <div className={cn("mb-2 grid grid-cols-7 px-2", cardBg, "rounded-sm")}>
        {daysOfWeek.map((day) => (
          <div key={day} className="p-1.5 text-center text-white">
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7">
        {daysInMonth.map((day, idx) => {
          const hasTransaction =
            day &&
            list.some(
              (exp) =>
                moment(exp.onDate).date() === day &&
                moment(exp.onDate).month() === currentMonth &&
                moment(exp.onDate).year() === currentYear,
            );

          return (
            <Flexcol
              key={idx}
              className="relative cursor-pointer items-center gap-0 py-1.5"
            >
              {day ? (
                <>
                  <div
                    className={`mb-0.5 size-2 rounded-full ${
                      hasTransaction
                        ? isExpense
                          ? "bg-exp-a0"
                          : "bg-inc-a1"
                        : "bg-transparent"
                    }`}
                  />
                  {day}
                </>
              ) : (
                <span className="opacity-0">•</span>
              )}
            </Flexcol>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalander;
