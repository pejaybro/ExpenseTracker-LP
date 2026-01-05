import { savingsGoalModal } from "../models/savings-goal-modal.js";

export const createGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = { userId, ...req.body };
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

export const fetchGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await savingsGoalModal
      .find({ userId })
      .sort({ isCompleted: 1, createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Fetch Savings Goal Data" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id, updatedAmount, isCompleted } = req.body;

    const update = { $push: { log: { amount: updatedAmount } } };
    if (isCompleted) update.$set = { isCompleted: true };

    const updatedGoal = await savingsGoalModal.findByIdAndUpdate(
      userId,
      _id,
      update,
      {
        new: true,
      }
    );

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Update Savings Goal Data" });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id } = req.body;

    const deletedGoal = await savingsGoalModal.findOneAndDelete({
      userId,
      _id,
    });

    res.status(200).json(deletedGoal);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete Savings Goal " });
  }
};
