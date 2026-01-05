import { budgetModal } from "../models/budget-modal.js";

export const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, amount } = req.body;

    const result = await budgetModal.updateOne(
      { userId, year, "budgetList.month": month },
      {
        $set: {
          "budgetList.$.budget": amount,
        },
      }
    );

    if (result.modifiedCount === 0) {
      await budgetModal.updateOne(
        { userId, year },
        {
          $push: {
            budgetList: { month, budget: amount },
          },
        }
      );
    }
    const updatedBudgetData = await budgetModal
      .find({ userId })
      .sort({ year: 1 });
    return res.status(200).json(updatedBudgetData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete budget" });
  }
};
export const setBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, amount } = req.body;

    // First, try to update an existing month in the budgetList array
    const result = await budgetModal.updateOne(
      { userId, year, "budgetList.month": month },
      {
        $set: {
          "budgetList.$.budget": amount,
        },
      }
    );

    // If no document was modified, it means the month wasn't in the array.
    if (result.modifiedCount === 0) {
      // So, we push it. We use upsert:true to also create the yearly doc if it doesn't exist.
      await budgetModal.updateOne(
        { userId, year },
        {
          $push: {
            budgetList: { month, budget: amount },
          },
        },
        { upsert: true }
      );
    }

    // After the update, re-fetch the entire budget data to send back to the client
    // for a consistent optimistic update.
    const updatedBudgetData = await budgetModal
      .find({ userId })
      .sort({ year: 1 });
    return res.status(200).json(updatedBudgetData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to set budget" });
  }
};

/* NOTE - fetchBudget
 ** it will fetch the budget data of given user
 ** if no data is found then return null
 */
export const fetchBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    let budgetData = [];
    let isNewYearCreated = false;
    const currentYear = new Date().getFullYear();
    budgetData = await budgetModal.find({ userId }).sort({ year: 1 });

    const insertDummyBudget = async () =>
      await budgetModal.create({
        userId,
        year: currentYear,
        budgetList: [
          {
            month: new Date().getMonth(),
            budget: 0,
          },
        ],
      });

    if (!budgetData.length) {
      const bud = await insertDummyBudget();
      budgetData.push(bud);
    }
    const hasCurrentYear = budgetData.some(b => b.year === currentYear);
    if (!hasCurrentYear) {
      isNewYearCreated = true;
      const bud = await insertDummyBudget();
      budgetData.push(bud);
    }

    res.status(200).json({ data: budgetData, meta: { isNewYearCreated } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Fetch Budget" });
  }
};
