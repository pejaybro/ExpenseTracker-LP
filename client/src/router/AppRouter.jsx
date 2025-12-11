import Home from "@/pages/home/home.jsx";
import Expense from "@/pages/expense/Expense.jsx";
import Income from "@/pages/income/Income.jsx";
import HomeIndex from "@/pages/home/index.jsx";
import ExpenseIndex from "@/pages/expense/index.jsx";
import IncomeIndex from "@/pages/income/index.jsx";
import ExpenseForm from "@/components/Forms/Expense_Form.jsx";
import IncomeForm from "@/components/Forms/Income_Form.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATH } from "./routerConfig.js";
import Reccuring from "@/pages/reccuring-expense/Reccuring.jsx";
import ReccuringExpenseIndex from "@/pages/reccuring-expense/index.jsx";
import Trip from "@/pages/trip-expense/trip.jsx";
import Budget from "@/pages/budget/budget.jsx";
import BudgetIndex from "@/pages/budget/index.jsx";
import ReccuringExpenseForm from "@/components/Forms/reccuring-expense-form.jsx";
import TripIndex from "@/pages/trip-expense/index.jsx";
import TripDetails from "@/pages/trip-expense/trip-details.jsx";
import TripExpenseForm from "@/components/Forms/trip-expense-form.jsx";
import Analysis from "@/pages/analysis/analysis.jsx";
import Setting from "@/pages/user-setting/setting.jsx";
import SettingIndex from "@/pages/user-setting/index.jsx";
import Goal from "@/pages/goal/goal.jsx";
import GoalIndex from "@/pages/goal/index.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATH.home} />} />
      <Route path={PATH.home} element={<Home />}>
        <Route index element={<HomeIndex />} />
        {formRoutes()}
      </Route>
      <Route path={PATH.expense} element={<Expense />}>
        <Route index element={<ExpenseIndex />} />
        {formRoutes()}
      </Route>
      <Route path={PATH.income} element={<Income />}>
        <Route index element={<IncomeIndex />} />
        {formRoutes()}
      </Route>
      <Route path={PATH.analysis} element={<Analysis />}></Route>

      <Route path={PATH.trip} element={<Trip />}>
        <Route index element={<TripIndex />} />
        <Route path={":tripid"} element={<TripDetails />} />
        <Route
          path={`:tripid/${PATH.addTripExpense}`}
          element={<TripExpenseForm />}
        />
        {formRoutes()}
      </Route>

      <Route path={PATH.repeat} element={<Reccuring />}>
        <Route index element={<ReccuringExpenseIndex />} />
        <Route
          path={PATH.addRepeatingExpense}
          element={<ReccuringExpenseForm />}
        />
        {formRoutes()}
      </Route>

      <Route path={PATH.budget} element={<Budget />}>
        <Route index element={<BudgetIndex />} />
        {formRoutes()}
      </Route>
      <Route path={PATH.setting} element={<Setting />}>
        <Route index element={<SettingIndex />} />
        {formRoutes()}
      </Route>
      <Route path={PATH.goal} element={<Goal />}>
        <Route index element={<GoalIndex />} />
        {formRoutes()}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const formRoutes = () => (
  <>
    <Route path={PATH.addExpense} element={<ExpenseForm />} />
    <Route path={PATH.addIncome} element={<IncomeForm />} />
  </>
);

// A simple component for the 404 page
const NotFound = () => <h1>404 - Page Not Found</h1>;

export { AppRouter };
