import { Icons } from "../icons";

const SectionTitle = ({
  title,
  isAnalysis,
  isExpense,
  isIncome,
  isBudget,
  isTrip,
}) => {
  return (
    <>
      <div className="text-14px flex flex-row items-center pb-5">
        <span>
          <Icons.window />
        </span>

        <span className="font-para2-m min-w-fit pr-5 pl-2.5"> {title}</span>

        <span className="h-[0.5px] w-full rounded-full bg-[#454545]"></span>
        <span className="pl-5">
          {isAnalysis && <Icons.analysis />}
          {isExpense && <Icons.expense />}
          {isIncome && <Icons.income />}
          {isBudget && <Icons.calc />}
          {isTrip && <Icons.trip />}
        </span>
      </div>
    </>
  );
};

export default SectionTitle;
