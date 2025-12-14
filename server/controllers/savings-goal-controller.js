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

export const fetchGoal = async (req, res) => {
  try {
    let { userID } = req.params;
    userID = parseInt(userID, 10);
    if (isNaN(userID)) {
      return res
        .status(400)
        .json({ message: "Invalid userID format. Must be a number." });
    }
    const data = await savingsGoalModal
      .find({ userID })
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
    const { _id, updatedAmount, isCompleted } = req.body;

    const update = { $push: { log: { amount: updatedAmount } } };
    if (isCompleted) update.$set = { isCompleted: true };

    const updatedGoal = await savingsGoalModal.findByIdAndUpdate(_id, update, {
      new: true,
    });

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Update Savings Goal Data" });
  }
};
