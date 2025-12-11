import express from "express";
import { goalValivation } from "../middlewares/savings-goal-validation.js";
import { createGoal } from "../controllers/savings-goal-controller.js";

const goalRouter = express.Router();

goalRouter.post("/create-goal", goalValivation,createGoal);

export { goalRouter };
