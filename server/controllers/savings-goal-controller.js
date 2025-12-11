import mongoose from "mongoose";
import { savingsGoalModal } from "../models/savings-goal-modal.js";

export const createGoal = async (req, res) => {
  try {
    const data = req.body;
    const goal = new savingsGoalModal(data);
    const savedGoal = await goal.save();
    return res.status(201).json(savedGoal);
  } catch (error) {
    console.error(
      `An error occurred while creating ${
        req.body.title ?? "new"
      } Savings Goal :`,
      error
    );
    return res.status(500).json({
      message: error.message || "Failed to Create Goal",
    });
  }
};
