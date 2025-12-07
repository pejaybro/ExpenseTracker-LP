import moment from "moment";
import ExpButton from "../buttons/exp-button";
import { FaCalendarDay, FaClock, FaPowerOff } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { IoMdSettings } from "react-icons/io";
import SelectFilter from "../selectFilter/SelectFilter";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import SelectBar from "../selectFilter/SelectBar";
import SelectCard from "../selectFilter/SelectCard";
import Flexrow from "../section/flexrow";
import { BiSolidBell } from "react-icons/bi";

const style = "!text-12px w-max font-para2-m space-x-0.75 p-1";

export const Logo = () => {
  return (
    <div className="font-title tracking-wide">
      <span className="text-slate-a2">Spese</span>
      <span className="text-exp-a0">ly</span>
    </div>
  );
};

export const ActiveDate = () => {
  const currentDate = moment().format("DD MMMM, YYYY");
  return (
    <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
      <FaCalendarDay />
      <span>{currentDate}</span>
    </ExpButton>
  );
};

export const ActiveClock = () => {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
      <FaClock />
      <span> {time.format("hh:mm A")}</span>
    </ExpButton>
  );
};

export const PageTitle = ({ nav, activeBtn }) => {
  return (
    <ExpButton custom_textbtn className={cn(style, "cursor-default")}>
      <Icons.window />
      {nav.find((n) => n.link === activeBtn)?.name}
    </ExpButton>
  );
};

export const UserLogout = () => {
  return (
    <ExpButton
      custom_textbtn
      className={cn(
        style,
        "text-14px hover:bg-dark-a5 w-full justify-start px-2",
      )}
    >
      <FaPowerOff />
      Logout
    </ExpButton>
  );
};

export const UserSettings = ({ ...props }) => {
  return (
    <ExpButton
      {...props}
      custom_textbtn
      className={cn(
        style,
        "text-14px hover:bg-dark-a5 w-full justify-start px-2",
      )}
    >
      <IoMdSettings />
      Settings
    </ExpButton>
  );
};

export const NotiBell = ({ ...props }) => {
  return (
    <ExpButton
      {...props}
      custom_textbtn
      className={cn(
        style,
        "text-14px hover:bg-dark-a5 w-full justify-start px-2",
      )}
    >
      <BiSolidBell />
      Notification
    </ExpButton>
  );
};

export const GlobalFilter = () => {
  const {
    currentFilter,
    filterTypes,
    handleFilterChange,
    handleYearChange,
    handleMonthChange,
    MonthList,
    YearsList,
    year,
    month,
  } = useFilterConfig();

  return (
    <>
      <Flexrow className={"text-dark-a3 w-max items-center gap-1"}>
        <Icons.filter_global className={cn("text-[16px]")} />
        <span className="text-14px font-para2-b">Global Filter</span>
      </Flexrow>
      <SelectFilter
        className={"bg-dark-a3 min-w-35"}
        onValueChange={handleFilterChange}
        value={currentFilter.type}
        list={Object.values(filterTypes)}
      />
      {(currentFilter.type === filterTypes.BY_YEAR ||
        currentFilter.type === filterTypes.BY_MONTH) && (
        <>
          <SelectFilter
            className={"bg-dark-a3 min-w-35"}
            onValueChange={handleYearChange}
            value={year}
            list={YearsList}
          />
          {currentFilter.type === filterTypes.BY_MONTH && (
            <SelectFilter
              isMonth
              className={"bg-dark-a3 min-w-35"}
              onValueChange={handleMonthChange}
              value={month}
              list={MonthList}
            />
          )}
        </>
      )}
    </>
  );
};
