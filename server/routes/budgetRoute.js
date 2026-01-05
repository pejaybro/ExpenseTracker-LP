import express from "express";
import {
  deleteBudget,
  fetchBudget,
  setBudget,
} from "../controllers/budget-controller.js";
import { NewBudget } from "../middlewares/budget-validation.js";
import { protect } from "../middlewares/auth.js";

const budgetRouter = express.Router();

budgetRouter.get("/get-data", protect, fetchBudget);
budgetRouter.post("/set-budget", protect, NewBudget, setBudget);
budgetRouter.post("/delete-budget", protect, NewBudget, deleteBudget);

export { budgetRouter };
