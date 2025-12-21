import Flexcol from "../section/flexcol";

import Flexrow from "../section/flexrow";

import { GraphTitleSquare } from "./linear-graph-data";
import { Icons } from "../icons";
import useTotalConfig from "@/hooks/useTotalConfig";
import { amountFloat } from "../utilityFilter";
import { cardBgv2 } from "@/global/style";
import { cn } from "@/lib/utils";
import { useGraphConfig } from "@/hooks/useGraphConfig";
import VerticalDevider from "../strips/vertical-devider";
import { CardContent } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const IncomeCategoryAnalysis = () => {
  const { FilteredZerosSubCategory, SubCategory } = useTotalConfig();
  const { GraphTitle, GraphSubText, GraphFootText, TitleTotal } =
    useGraphConfig({ isExpense: false });

  const chartData = SubCategory.income.map((s) => ({
    indicator: s.categoryName,
    Amount: s.amount,
  }));
  const color = "var(--color-inc)";
  const label = "Income";

  const chartConfig = {
    [label]: {
      label: label,
      color: color,
    },
  };

  const myLabelFormatter = (value, payload) => {
    return (
      <span style={{ color: color }} className="font-para2-b">
        For : {value}
      </span>
    );
  };

  const myTooltipFormatter = (value, name, item, index, payload) => {
    return (
      <div key={item.dataKey} className="flex w-full items-center gap-2">
        {/* Indicator */}
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        {/* Label and Value */}
        <div className="text-slate-a1 flex flex-1 justify-between leading-none font-para2-m">
          <span className="pr-1">{item.name || name} : </span>
          <span>{amountFloat(value)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Flexcol className={cn("text-slate-a1 gap-2 p-10 px-12", cardBgv2)}>
        <Flexrow className="items-center gap-2 font-para2-b">
          <GraphTitleSquare className={"bg-inc-a2"} />
          <span className="pr-2">{GraphTitle} </span>
          <span className="text-14px">
            <Icons.checkCircle className="text-inc-a3" />
          </span>
          <span>Total Income </span>
          Rs.
          <span className="text-inc-a3">{amountFloat(TitleTotal?.i)}</span>
        </Flexrow>
        <Flexrow className={"!text-14px items-center font-para2-r gap-2 pb-2"}>
          Total Earning per Sub-Category of Income
        </Flexrow>
        <Flexrow className={"pb-5"}>
          <CardContent className="flex-1 p-0">
            <ChartContainer
              config={chartConfig}
              className={cn("max-h-[200px] w-full")}
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 25,
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid stroke="var(--color-dark-a6)" vertical={false} />
                <XAxis
                  dataKey="indicator"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  minTickGap={20}
                  className="[&_.recharts-cartesian-axis-tick_text]:fill-slate-a4"
                  tickFormatter={(value) => value}
                  interval={"preserveStartEnd"}
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className={"bg-dark-a1.2 border-dark-a6"}
                      formatter={myTooltipFormatter}
                      hideIndicator={false}
                      labelFormatter={myLabelFormatter}
                    />
                  }
                />

                <Area
                  dataKey={"Amount"}
                  type="monotone"
                  fill={color}
                  fillOpacity={0.2}
                  stroke={color}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Flexrow>
        <Flexrow className={"flex-wrap gap-2.5 font-para2-b"}>
          {FilteredZerosSubCategory.income.map((sc, idx) => (
            <Flexrow
              key={sc.id}
              className={cn(
                "text-14px !text-slate-a3 border-slate-a7 w-max cursor-pointer items-center gap-2 rounded-sm border px-2.5 py-1 ",
              )}
            >
              <span className="text-14px">
                <Icons.checkCircle className={"text-inc-a2"} />
              </span>
              <span>{sc.categoryName}</span>
              <VerticalDevider className="mx-0.25 bg-white" />
              <Flexrow className={"w-max items-center gap-0.75"}>
                <span className="text-12px">
                  <Icons.rupee />
                </span>
                <span className="text-inc-a3">{sc.amount}</span>
              </Flexrow>
            </Flexrow>
          ))}
        </Flexrow>
        <Flexrow className={"!text-14px items-center font-para2-r text-slate-a4 gap-2 pt-5"}>
          <Icons.textline />
          {GraphFootText}
        </Flexrow>
      </Flexcol>
    </>
  );
};

export default IncomeCategoryAnalysis;
