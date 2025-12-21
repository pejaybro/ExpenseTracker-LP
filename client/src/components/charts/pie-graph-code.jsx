import { useState, useMemo } from "react";
import { Pie, PieChart, Cell, Sector, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Icons } from "../icons";
import { amountFloat } from "../utilityFilter";
import { cn } from "@/lib/utils";
import { cardBgv2 } from "@/global/style";

import Flexrow from "../section/flexrow"; // Added
import Flexcol from "../section/flexcol"; // Added

import { expenseCategories } from "@/global/categories";
import VerticalDevider from "../strips/vertical-devider";
import { GraphTitleSquare } from "../analysis/linear-graph-data";
import SelectBar from "../selectFilter/SelectBar";
import SelectCard from "../selectFilter/SelectCard";
import SelectFilter from "../selectFilter/SelectFilter";
import { useGraphConfig } from "@/hooks/useGraphConfig";

// Helper component for the sub-category tile, using your provided JSX
const SubCategoryTile = ({ subCategory, color }) => {
  // Use inline style for dynamic text color
  const colorStyle = {
    color: color || "var(--color-slate-a1)",
  };

  return (
    <Flexrow
      className={cn(
        "text-16px !text-slate-a3 font-para2-b h-max w-max cursor-pointer items-center gap-2 rounded-sm px-2.5",
      )}
    >
      <span>
        {/* Use inline style for the icon color */}
        <Icons.checkCircle style={colorStyle} />
      </span>
      {/* Use categoryName from selector, flex-1 to push amount to the right */}
      <span className="flex-1">{subCategory.categoryName}</span>
      <VerticalDevider className="mx-0.25 bg-white" />
      <Flexrow className={"w-max items-center gap-0.75"}>
        <span className="text-12px">
          <Icons.rupee />
        </span>
        {/* Use amount from selector and apply color style */}
        <span style={colorStyle}>{amountFloat(subCategory.amount)}</span>
      </Flexrow>
    </Flexrow>
  );
};

export const PieGraphCode = ({
  graphHeightClass,
  graphInfo = {
    data: [],
    sub: [],
  },
  chartInfo = {
    title: false,
    subtext: false,
    footertext: false,
  },
}) => {
  const chartData = graphInfo.data;
  const allSubCategoryData = graphInfo.sub;
  const { GraphTitle, GraphSubText, GraphFootText } = useGraphConfig({
    isExpense: true,
  });

  // State to manage the active/highlighted slice
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive the active prime category entry from the data and index
  const activeEntry = useMemo(
    () => chartData[activeIndex] || null,
    [activeIndex, chartData],
  );

  // --- Filter Sub-Categories based on Active Prime Category ---
  const activeSubCategories = useMemo(() => {
    if (!activeEntry || !allSubCategoryData) return [];
    // Filter subcategories for the active prime category
    // and only show those with an amount > 0, sorted by amount
    return allSubCategoryData.filter(
      (sub) => sub.primeName === activeEntry.primeName,
    );
  }, [activeEntry, allSubCategoryData]);

  console.log("subs", allSubCategoryData);
  console.log("prime", activeEntry);

  // Create the chartConfig object for the ChartContainer and Tooltip
  const chartConfig = useMemo(() => {
    if (!chartData) return {};
    return expenseCategories.reduce((config, category) => {
      config[category.title] = {
        label: category.title,
        color: category.color || "var(--color-misc)",
      };
      return config;
    }, {});
  }, [expenseCategories, chartData]);

  // Handler for the dropdown select
  const handleSelectChange = (value) => {
    const newIndex = chartData.findIndex((item) => item.primeName === value);
    if (newIndex !== -1) {
      setActiveIndex(newIndex);
    }
  };

  // Custom Tooltip Formatter
  const myTooltipFormatter = (value, name, item) => {
    const indicatorColor = item.payload.fill || item.color;
    return (
      <div key={item.dataKey} className="flex w-full items-center gap-2">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: indicatorColor }}
        />
        <div className="text-slate-a1 flex flex-1 justify-between gap-2 leading-none font-para2-m">
          <span className="pr-1">{name} : </span>
          <span>{amountFloat(value)}</span>
        </div>
      </div>
    );
  };

  const bgColor = chartConfig[activeEntry?.primeName]?.color;

  return (
    <>
      <Flexrow className="font-para2-m flex-wrap">
        <Flexcol className={cn("flex-1 justify-between gap-2 p-8", cardBgv2)}>
          {/** TOP SECTION */}

          <Flexcol className="gap-2">
            <Flexrow className={"justfy-strat !text-16px items-center gap-1.5"}>
              <GraphTitleSquare
                style={{
                  backgroundColor: bgColor,
                }}
              />
              <span>{activeEntry?.primeName}</span>
              <span>{GraphTitle}</span>
            </Flexrow>
            <Flexrow className={"justfy-strat !text-16px items-center gap-1.5"}>
              <Icons.checkCircle
                className="text-18px"
                style={{
                  color: bgColor,
                }}
              />
              <span>Total Expense</span>
              Rs.
              <span
                className="font-para2-b"
                style={{
                  color: bgColor,
                }}
              >
                {amountFloat(activeEntry?.amount)}
              </span>
            </Flexrow>
            <Flexrow>
              <span className="text-slate-a1 !text-14px font-para2-r">
                {GraphSubText}
              </span>
            </Flexrow>
          </Flexcol>

          {/** Middle SECTION */}

          <ChartContainer
            config={chartConfig}
            // Adjusted size for the left side
            className={cn("my-2.5 aspect-square max-h-[400px] min-h-[360px]")}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className={"bg-dark-a1.2 border-dark-a6"}
                    formatter={myTooltipFormatter}
                    hideIndicator={false}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="primeName"
                innerRadius={60}
                outerRadius={150}
                strokeWidth={5}
                activeIndex={activeIndex} // or state-driven (recommended below)
                activeShape={({ outerRadius = 0, ...props }) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={chartConfig[entry?.primeName]?.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/** BOTTOM SECTION */}

          <Flexrow className="text-slate-a4 !text-14px font-para2-r items-center justify-start gap-2 pt-2.5">
            <Icons.textline /> {GraphFootText}
          </Flexrow>
        </Flexcol>
        <Flexcol className={cn("flex-1 justify-between gap-2 p-8", cardBgv2)}>
          {/** TOP SECTION */}

          <Flexcol className={"items-start gap-2"}>
            <Flexrow className={"items-center gap-2"}>
              <GraphTitleSquare
                style={{
                  backgroundColor: bgColor,
                }}
              />
              <SelectCard className={"font-para2-r"} title={" Breakdown for"}>
                <SelectFilter
                 className={"bg-dark-a2"}
               
                 contentClass={"bg-dark-a2"}
                  onValueChange={handleSelectChange}
                  value={activeEntry?.primeName}
                  list={chartData}
                  isChart
                />
              </SelectCard>
            </Flexrow>

            <span className="text-slate-a1 font-para2-r !text-14px">
              Total Spending per Sub-Category
            </span>
          </Flexcol>

          {/** Middle SECTION */}

          <Flexcol className={"h-max items-start justify-center gap-2.5 py-5"}>
            {activeSubCategories.map((sub) => (
              <SubCategoryTile
                key={sub.id}
                subCategory={sub}
                color={chartConfig[activeEntry?.primeName]?.color}
              />
            ))}
          </Flexcol>

          {/** BOTTOM SECTION */}
          <Flexrow className="text-slate-a4 font-para2-r !text-14px items-center justify-start gap-2 pt-2.5">
            <Icons.textline /> Showing all sub-categories for{" "}
            {activeEntry?.primeName}
          </Flexrow>
        </Flexcol>
      </Flexrow>
    </>
  );
};

export default PieGraphCode;

/**!SECTION
 * 
 * 
 * 
 * 
 * 
 *   
        
        
       

        <Flexrow>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              // Adjusted size for the left side
              className={cn("aspect-square h-[400px] w-max")}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className={"bg-dark-a1.2 border-dark-a6"}
                      formatter={myTooltipFormatter}
                      hideIndicator={false}
                    />
                  }
                />
           
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="categoryName"
                  innerRadius={60} // Your value
                  strokeWidth={0} // Your value
                  activeIndex={activeIndex}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 30}
                        innerRadius={outerRadius + 16}
                      />
                    </g>
                  )}
                  // onMouseEnter removed as requested
                >
                 

                
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={chartConfig[entry.categoryName]?.color}
                      stroke={chartConfig[entry.categoryName]?.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <Flexrow className="gap-2 h-full flex-wrap justify-end items-center">
            {activeSubCategories.length > 0 ? (
            
                
              ))
            ) : (
              <div className="text-slate-a4 flex h-full items-center justify-center">
                No sub-category expenses for {activeEntry?.categoryName}.
              </div>
            )}
          </Flexrow>
        </Flexrow>

        <Flexrow className={"justify-between"}>
          <CardFooter className="text-slate-a4 !text-14px flex-row items-center justify-start gap-2">
            <Icons.textline /> Showing transaction records by category
          </CardFooter>
          <Flexrow className={"w-max justify-end"}>uihoih</Flexrow>
        </Flexrow>


 */
