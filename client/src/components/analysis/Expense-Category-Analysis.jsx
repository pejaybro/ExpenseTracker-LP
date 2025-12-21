import useTotalConfig from "@/hooks/useTotalConfig";
import Flexcol from "../section/flexcol";
import Flexrow from "../section/flexrow";
import FlexrowStrip from "../strips/flexrow-strip";
import { Card, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { GraphTitleSquare } from "./linear-graph-data";
import { CurrentYear } from "@/utilities/calander-utility";
import { useEffect, useState } from "react";
import { getPrimeColor } from "@/global/categories";
import useMinMaxConfig from "@/hooks/useMinMaxConfig";
import { Icons } from "../icons";
import HorizontalDivider from "../strips/horizontal-divider";
import { amountFloat } from "../utilityFilter";
import Boxcard from "../section/boxcard";
import SelectBar from "../selectFilter/SelectBar";
import SelectCard from "../selectFilter/SelectCard";
import SelectFilter from "../selectFilter/SelectFilter";
import { cn } from "@/lib/utils";
import { cardBgv2 } from "@/global/style";

export const spendBar = (input, total, name) => {
  const p = Math.round((input / total) * 100);
  return {
    width: `${p}%`,
    height: ".75rem",
    backgroundColor: getPrimeColor(name),
  };
};

const ExpenseCategoryAnalysis = () => {
  //NOTE - year state
  const [year, setYear] = useState(CurrentYear());
  //NOTE - sets the year to get the months data
  const handleYearSelector = (year) => {
    setYear(Number(year));
    setSelected(0);
  };

  const {
    TotalByPrime_EXP,
    getPrimeListOfYear,
    TotalByYear_EXP,
    getTotalOfYear,
    TotalBySub_EXP,
    getSubListOfYear,
    YearsList,
  } = useTotalConfig();

  const { MMofPrime, MMgetPrimeofYear } = useMinMaxConfig();
  const mmPrime = MMgetPrimeofYear(MMofPrime, year);

  const PrimeOfYear = getPrimeListOfYear(TotalByPrime_EXP, year);
  const SubOfYear = getSubListOfYear(TotalBySub_EXP, year);
  const TotalExpenseYear = getTotalOfYear(TotalByYear_EXP, year);

  const [selected, setSelected] = useState(0);
  const [PrimeCat, setPrimeCat] = useState([]);
  const [SubCat, setSubCat] = useState([]);

  useEffect(() => {
    if (PrimeOfYear.length > 0) {
      setPrimeCat(PrimeOfYear[selected]);
      setSubCat(
        SubOfYear.filter((s) => s.primeName === PrimeOfYear[selected]?.name),
      );
    }
  }, [PrimeOfYear, SubOfYear, selected]);

  const handleChange = (index) => {
    if (selected === index) {
      setSelected(null); // uncheck if already selected
    } else {
      setSelected(index);
      const sub = SubOfYear.filter(
        (s) => s.primeName === PrimeOfYear[index].name,
      );
      setSubCat(sub);
      setPrimeCat(PrimeOfYear[index]);
    }
  };

  return (
    <>
      <Flexcol>
        <Flexrow>
          <SelectBar>
            <SelectCard isExpense title={"Select Year"}>
              <SelectFilter
                placeholder={"Select Year"}
                onValueChange={handleYearSelector}
                defaultValue={String(CurrentYear())}
                list={YearsList}
              ></SelectFilter>
            </SelectCard>
          </SelectBar>
        </Flexrow>
        <Flexrow>
          <Flexcol className={cn("text-slate-a1 gap-2 p-10 px-12", cardBgv2)}>
            <Flexrow className="font-para2-m items-center gap-2">
              <GraphTitleSquare className={"bg-exp-a1"} />
              Prime Category - {year}
              <Icons.checkCircle className="text-exp-a3 ml-2" />
              Total Expense
              <HorizontalDivider className="bg-white" />
              Rs.
              <span className="text-exp-a3">
                {amountFloat(TotalExpenseYear)}
              </span>
            </Flexrow>
            <p className={"text-14px pb-5"}>
              Bars Showing Expense in a Year by Category
            </p>
            {PrimeOfYear.map((m, idx) => (
              <Flexrow key={idx} className={"items-center py-2"}>
                <Checkbox
                  className={
                    "data-[state=checked]:bg-exp-a1 border-slate-a8 size-5 border hover:cursor-pointer"
                  }
                  onCheckedChange={() => handleChange(idx)}
                  checked={selected === idx}
                />
                <Flexcol className="gap-1.5">
                  <Flexrow className={"text-14px items-center gap-2"}>
                    <GraphTitleSquare
                      className={"size-3"}
                      style={{ backgroundColor: getPrimeColor(m.name) }}
                    />
                    {m.name}

                    <Icons.checkCircle
                      className="ml-2"
                      style={{ color: getPrimeColor(m.name) }}
                    />

                    <Flexrow className={"w-max items-center gap-0.25"}>
                      <Icons.rupee className="text-12px pr-1" />
                      {amountFloat(m.total)}
                    </Flexrow>
                  </Flexrow>
                  <div
                    style={spendBar(m.total, mmPrime.max.total, m.name)}
                    className="rounded-md"
                  ></div>
                </Flexcol>
              </Flexrow>
            ))}
            <Flexrow
              className={"!text-14px items-center justify-center gap-2 pt-5"}
            >
              <Icons.textline /> Showing Total Expense of Each Prime Categories
              in Year
            </Flexrow>
          </Flexcol>

          <Flexcol
            className={cn(
              "text-slate-a1 h-max w-100 flex-wrap gap-2 p-8",
              cardBgv2,
            )}
          >
            <Flexrow className="font-para2-m items-center gap-2">
              <GraphTitleSquare className={"bg-exp-a1"} />
              Sub Categories
            </Flexrow>
            <Flexrow
              className={"!text-14px items-center justify-center gap-2 pb-6"}
            >
              Expenses in Each Sub Categories of Selected Prime Category
            </Flexrow>
            {SubCat.map((sc, idx) => (
              <>
                <Flexrow
                  key={idx}
                  className={cn(
                    "text-14px !text-slate-a3 border-slate-a7 font-para2-m w-max cursor-pointer items-center gap-2 rounded-sm border px-2.5 py-1",
                  )}
                >
                  <Icons.checkCircle className={"text-exp-a3"} />
                  {sc.subName}
                  <HorizontalDivider className="mx-0.25 bg-white" />
                  <Flexrow className={"w-max items-center gap-0.75"}>
                    <Icons.rupee className="text-12px" />
                    {sc.total}
                  </Flexrow>
                </Flexrow>
              </>
            ))}
            <Flexrow className={"font-para2-m items-center gap-2 pt-6"}>
              <Icons.checkCircle className="text-exp-a1 !text-14px" />
              Total
              <Flexrow className={"w-max items-center gap-0.5"}>
                <Icons.rupee className="text-12px" />
                {PrimeCat.total}
              </Flexrow>
            </Flexrow>
            <Flexrow className={"!text-14px w-max items-center gap-2"}>
              <GraphTitleSquare className={"bg-exp-a1 size-3"} />
              In {PrimeCat.name}
            </Flexrow>
          </Flexcol>
        </Flexrow>
      </Flexcol>
    </>
  );
};

export default ExpenseCategoryAnalysis;
