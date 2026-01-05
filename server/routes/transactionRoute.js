import express from "express";
import {
  expenseValidation,
  incomeValidation,
  recurringValidation,
} from "../middlewares/transaction-validation.js";

import {
  deleteExpense,
  deleteIncome,
  deleteRecurringExpense,
  fetchExpense,
  fetchIncome,
  fetchRecurringExpense,
  insertExpense,
  insertIncome,
  insertRecurringExpense,
  updateExpense,
  updateIncome,
  updateRecurringExpense,
} from "../controllers/transaction-controller.js";
import { protect } from "../middlewares/auth.js";

const transactionRouter = express.Router();

//* ====================== INSERT API ======================
transactionRouter.post(
  "/add-expense",
  protect,
  expenseValidation,
  insertExpense
);
transactionRouter.post("/add-income", protect, incomeValidation, insertIncome);
transactionRouter.post(
  "/add-recurring-expense",
  protect,
  recurringValidation,
  insertRecurringExpense
);

//* ====================== UPADTE API ======================

transactionRouter.post(
  "/update-expense",
  protect,
  expenseValidation,
  updateExpense
);
transactionRouter.post(
  "/update-income",
  protect,
  incomeValidation,
  updateIncome
);
transactionRouter.post(
  "/update-recurring-expense",
  protect,
  recurringValidation,
  updateRecurringExpense
);

//* ====================== DELETE API ======================
transactionRouter.delete("/delete-expense/:expID", protect, deleteExpense);
transactionRouter.delete(
  "/delete-recurring-expense/:recExpID",
  protect,
  deleteRecurringExpense
);
transactionRouter.delete("/delete-income/:incID", protect, deleteIncome);

//* ====================== FETCH API ======================
transactionRouter.get("/get-expense", protect, fetchExpense);
transactionRouter.get("/get-recurring-expense", protect, fetchRecurringExpense);
transactionRouter.get("/get-income", protect, fetchIncome);

export { transactionRouter };
