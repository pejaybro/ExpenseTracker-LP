import express from "express";
import { goalValivation } from "../middlewares/savings-goal-validation.js";
import {
  createGoal,
  fetchGoal,
  updateGoal,
} from "../controllers/savings-goal-controller.js";

const goalRouter = express.Router();

goalRouter.post("/create-goal", goalValivation, createGoal);
goalRouter.get("/get-goal/:userID", fetchGoal);
goalRouter.patch("/update-goal", updateGoal);

export { goalRouter };
