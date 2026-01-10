import { baseBtn, Btn_card, Btn_icon, Btn_text } from "@/global/style";
import { cn } from "@/lib/utils";
import { PATH } from "@/router/routerConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../icons";
import BudgetPop from "../budget/budget-pop";
import TooltipStrip from "../strips/tooltip-strip";

const ExpButton = ({
  addExpense,
  addIncome,
  addReccuring,
  addReccuring_card,
  addTrip,
  setBudget_textbtn,
  newBudget_textbtn,
  editBudget_textbtn,
  setBudget_iconbtn,
  newBudget_iconbtn,
  editBudget_iconbtn,
  gotoPage_iconbtn,
  edit_iconbtn,
  delete_iconbtn,
  as = "button",
  custom_iconbtn,
  custom_textbtn,
  custom_toolContent,

  className,
  children,
  ...props
}) => {
  const Component = as;
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {/** ============================ */}

      {custom_iconbtn && custom_toolContent && (
        <TooltipStrip content={custom_toolContent}>
          <Component
            {...props}
            className={cn(baseBtn, Btn_icon, "h-max", className)}
          >
            {children}
          </Component>
        </TooltipStrip>
      )}
      {custom_iconbtn && !custom_toolContent && (
        <Component
          {...props}
          className={cn(baseBtn, Btn_icon, "h-max", className)}
        >
          {children}
        </Component>
      )}
      {custom_textbtn && (
        <Component
          {...props}
        
          className={cn(baseBtn, Btn_text, "h-max", className)}
        >
          {children}
        </Component>
      )}

      {/** ============================ */}
      {addExpense && (
        <Component
          className={cn(baseBtn, Btn_text, "bg-exp-a3 text-dark-a1", className)}
          onClick={() =>
            navigate(PATH.addExpense, { state: { from: location } })
          }
        >
          <Icons.add_list className="text-18px" />
          <span className="text-14px"> New Expense</span>
        </Component>
      )}
      {/** ============================ */}
      {addIncome && (
        <Component
          className={cn(baseBtn, Btn_text, "bg-inc-a3 text-dark-a1", className)}
          onClick={() => navigate(PATH.addIncome)}
        >
          <Icons.add_list className="text-18px" />
          <span className="text-14px"> New Income</span>
        </Component>
      )}
      {/** ============================ */}
      {addReccuring && (
        <Component
          className={cn(baseBtn, Btn_text, "bg-rep-a3 text-dark-a1", className)}
          onClick={() => navigate(PATH.addRepeatingExpense)}
        >
          <Icons.add_list className="text-18px" />
          <span className="text-14px"> New Reccuring Expense</span>
        </Component>
      )}
      {addReccuring_card && (
        <Component
          className={cn(
            baseBtn,
            Btn_card,
            "from-rep-a1 to-rep-a3 text-dark-a1 bg-gradient-to-t",
            className,
          )}
          onClick={() => navigate(PATH.addRepeatingExpense)}
        >
          <Icons.add_list className="text-18px" />
          <span className="text-14px"> New Reccuring Expense</span>
        </Component>
      )}
      {/** ============================ */}
      {addTrip && (
        <Component
          className={cn(baseBtn, Btn_text, "bg-rep-a3 text-dark-a1", className)}
          onClick={() => navigate(PATH.addRepeatingExpense)}
        >
          <Icons.add_list className="text-18px" />
          <span className="text-14px"> New Reccuring Expense</span>
        </Component>
      )}
      {/** ============================ */}
      {(setBudget_textbtn || newBudget_textbtn || editBudget_textbtn) && (
        <BudgetPop
          isSet={setBudget_textbtn}
          isNew={newBudget_textbtn}
          isEdit={editBudget_textbtn}
        >
          <Component
            className={cn(
              baseBtn,
              Btn_text,
              "bg-bud-a3 text-dark-a1",
              className,
            )}
          >
            <Icons.add_list className="text-18px" />
            <span className="text-14px">
              {(setBudget_textbtn && "Set Budget") ||
                (newBudget_textbtn && "New Budget") ||
                (editBudget_textbtn && "Edit Budget")}
            </span>
          </Component>
        </BudgetPop>
      )}

      {(setBudget_iconbtn || newBudget_iconbtn || editBudget_iconbtn) && (
        <BudgetPop
          isSet={setBudget_iconbtn}
          isNew={newBudget_iconbtn}
          isEdit={editBudget_iconbtn}
        >
          <TooltipStrip
            content={
              (setBudget_iconbtn && "Set Budget") ||
              (newBudget_iconbtn && "Edit Budget") ||
              (editBudget_iconbtn && "Set New Budget")
            }
          >
            <Component
              className={cn(
                baseBtn,
                Btn_icon,
                "bg-bud-a3 text-dark-a2",
                className,
              )}
            >
              {(setBudget_iconbtn && <Icons.add_list />) ||
                (newBudget_iconbtn && <Icons.calnew />) ||
                (editBudget_iconbtn && <Icons.edit />)}
            </Component>
          </TooltipStrip>
        </BudgetPop>
      )}

      {/** ============================ */}

      {gotoPage_iconbtn && (
        <Component
          {...props}
          className={cn(baseBtn, Btn_icon, "bg-exp-a3 text-dark-a1", className)}
        >
          <Icons.gotoPage />
        </Component>
      )}
      {/** ============================ */}
      {edit_iconbtn && (
        <Component
          {...props}
          className={cn(baseBtn, Btn_icon, "bg-exp-a3 text-dark-a2", className)}
        >
          <Icons.edit />
        </Component>
      )}
      {/** ============================ */}
      {delete_iconbtn && (
        <Component
          {...props}
          className={cn(
            baseBtn,
            Btn_icon,
            "bg-error-a2 text-dark-a2",
            className,
          )}
        >
          <Icons.delete_bin />
        </Component>
      )}

      {/** ============================ */}
    </>
  );
};

export default ExpButton;
