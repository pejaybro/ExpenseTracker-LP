import express from "express";
import { goalValivation } from "../middlewares/savings-goal-validation.js";
import {
  createGoal,
  deleteGoal,
  fetchGoal,
  updateGoal,
} from "../controllers/savings-goal-controller.js";
import { protect } from "../middlewares/auth.js";

const goalRouter = express.Router();

goalRouter.post("/create-goal", protect, goalValivation, createGoal);
goalRouter.get("/get-goal/", protect, fetchGoal);
goalRouter.patch("/update-goal", protect, updateGoal);
goalRouter.delete("/delete-goal", protect, deleteGoal);

export { goalRouter };
