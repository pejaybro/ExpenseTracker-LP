import { Routes, Route, Navigate } from "react-router-dom";
import { PATH } from "./routerConfig.js";

/* Pages */
import Home from "@/pages/home/home.jsx";
import Expense from "@/pages/expense/Expense.jsx";
import Income from "@/pages/income/Income.jsx";
import Analysis from "@/pages/analysis/analysis.jsx";
import Reccuring from "@/pages/reccuring-expense/Reccuring.jsx";
import Trip from "@/pages/trip-expense/trip.jsx";
import Budget from "@/pages/budget/budget.jsx";
import Setting from "@/pages/user-setting/setting.jsx";
import Goal from "@/pages/goal/goal.jsx";
import Login from "@/pages/login-signup/login.jsx";
import Signup from "@/pages/login-signup/sign-up.jsx";

/* Index pages */
import HomeIndex from "@/pages/home/index.jsx";
import ExpenseIndex from "@/pages/expense/index.jsx";
import IncomeIndex from "@/pages/income/index.jsx";
import ReccuringExpenseIndex from "@/pages/reccuring-expense/index.jsx";
import TripIndex from "@/pages/trip-expense/index.jsx";
import BudgetIndex from "@/pages/budget/index.jsx";
import SettingIndex from "@/pages/user-setting/index.jsx";
import GoalIndex from "@/pages/goal/index.jsx";

/* Forms */
import ExpenseForm from "@/components/Forms/Expense_Form.jsx";
import IncomeForm from "@/components/Forms/Income_Form.jsx";
import ReccuringExpenseForm from "@/components/Forms/reccuring-expense-form.jsx";
import TripExpenseForm from "@/components/Forms/trip-expense-form.jsx";

/* Trip */
import TripDetails from "@/pages/trip-expense/trip-details.jsx";

/* protected Route */
import ProtectedRoute from "./ProtectedRoute.jsx";
import AppLayout from "@/pages/app-layout.jsx";
import PublicRoute from "./PublicRoute.jsx";
import GoogleAuthSuccess from "@/pages/google-auth-success.jsx";
import ResetPassword from "@/pages/login-signup/reset-password.jsx";

/* Auth */

/* ---------------------------------------------------
   App Router
--------------------------------------------------- */
const AppRouter = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={PATH.home} replace />} />

      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path={PATH.googleAuthSuccess} element={<GoogleAuthSuccess />} />
        <Route path={PATH.passwordReset} element={<ResetPassword />} />
        <Route path={PATH.login} element={<Login />} />
        <Route path={PATH.signup} element={<Signup />} />
      </Route>

      {/* Protected app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Home */}
          <Route path={PATH.home} element={<HomeIndex />} />

          {/* Expense */}
          <Route path={PATH.expense} element={<ExpenseIndex />}>
            {formRoutes()}
          </Route>

          {/* Income */}
          <Route path={PATH.income} element={<IncomeIndex />}>
            {formRoutes()}
          </Route>

          {/* Analysis */}
          <Route path={PATH.analysis} element={<Analysis />} />

          {/* Trip */}
          <Route path={PATH.trip} element={<TripIndex />} />
          <Route path={`${PATH.trip}/:tripid`} element={<TripDetails />} />
          <Route
            path={`${PATH.trip}/:tripid/${PATH.addTripExpense}`}
            element={<TripExpenseForm />}
          />

          {/* Recurring */}
          <Route path={PATH.repeat} element={<ReccuringExpenseIndex />} />
          <Route
            path={`${PATH.repeat}/${PATH.addRepeatingExpense}`}
            element={<ReccuringExpenseForm />}
          />

          {/* Budget */}
          <Route path={PATH.budget} element={<BudgetIndex />}>
            {formRoutes()}
          </Route>

          {/* Settings */}
          <Route path={PATH.setting} element={<SettingIndex />} />

          {/* Goal */}
          <Route path={PATH.goal} element={<GoalIndex />}>
            {formRoutes()}
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/* ---------------------------------------------------
   Shared form routes
--------------------------------------------------- */
const formRoutes = () => (
  <>
    <Route path={PATH.addExpense} element={<ExpenseForm />} />
    <Route path={PATH.addIncome} element={<IncomeForm />} />
  </>
);

/* ---------------------------------------------------
   Not Found
--------------------------------------------------- */
const NotFound = () => <h1>404 - Page Not Found</h1>;

export { AppRouter };
