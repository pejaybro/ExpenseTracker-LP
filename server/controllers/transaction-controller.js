/* eslint-disable no-undef */
import mongoose from "mongoose";
import {
  expenseModal,
  incomeModal,
  recurringExpModal,
} from "../models/transaction-modal.js";
import { decrementTotal, insertTotal } from "./total-controller.js";

import moment from "moment";
import { updateTripTotal } from "./trip-controller.js";
import { totalModal } from "../models/total-modal.js";

/**
 * *==================== FETCH Functions ====================
 * @see fetchExpense
 * @see fetchIncome
 * @see fetchRecurringExpense
 * @param  onDate :-1 in
 * expenseModal.find().sort() || incomeModal.find().sort() || recurringExpModal.find().sort()
 * will sort row with latest date to oldest
 */

export const fetchExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await expenseModal.aggregate([
      // Stage 1: Find all the expenses for the user
      { $match: { userId } },
      // Stage 2: Sort them by date, just like before
      { $sort: { onDate: -1 } },
      // Stage 3: JOIN with the 'trips' collection
      {
        $lookup: {
          from: "default-trip", // The name of the collection to join with
          localField: "ofTrip", // The field from the expense documents
          foreignField: "_id", // The field from the trip documents
          as: "tripInfo", // The name of the new array field to add
        },
      },
      // Stage 4: JOIN with the 'recurring_expenses' collection
      {
        $lookup: {
          from: "default-recurring", // Use your actual collection name
          localField: "ofRecurring",
          foreignField: "_id",
          as: "recurringInfo",
        },
      },

      // Stage 5: Clean up the output
      // $lookup returns an array. Since we only expect one match,
      // $unwind deconstructs the array to give us a single object.
      {
        $unwind: {
          path: "$tripInfo",
          preserveNullAndEmptyArrays: true, // Keep expenses that don't have a trip
        },
      },
      {
        $unwind: {
          path: "$recurringInfo",
          preserveNullAndEmptyArrays: true, // Keep expenses without a recurring rule
        },
      },

      // Stage 6 (Optional): Rename fields to match your original structure
      {
        $project: {
          // Keep all original expense fields
          userId: 1,
          isTypeExpense: 1,
          ofAmount: 1,
          isNote: 1,
          primeCategory: 1,
          subCategory: 1,
          onDate: 1,
          isTripExpense: 1,
          isRecurringExpense: 1,
          // Overwrite the original fields with the populated objects
          ofTrip: "$tripInfo",
          ofRecurring: "$recurringInfo",
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Fetch Expense Data" });
  }
};

export const fetchIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await incomeModal.find({ userId }).sort({ onDate: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Fetch Income Data" });
  }
};

export const fetchRecurringExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await recurringExpModal.find({ userId }).sort({ onDate: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Failed to Fetch Recurring Expense Data",
    });
  }
};

/**
 * *==================== INSERT Functions ====================
 * @see insertExpense
 * @see insertIncome
 * @see insertRecurringExpense
 */

export const insertExpense = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    // creating new expense
    const userId = req.user.id;
    const data = {
      userId,
      ...req.body,
    };
    const newExpense = new expenseModal(data);
    const savedEntry = await newExpense.save({ session });

    // updating total
    await insertTotal(savedEntry, session);

    // updating trip total
    if (savedEntry.isTripExpense === true) {
      const tripUpdated = await updateTripTotal(1, savedEntry, session);
      if (!tripUpdated) {
        throw new Error("Trip not found or does not belong to user");
      }
    }

    // updating trip total
    if (savedEntry.isRecurringExpense === true) {
      const recurringUpdated = await recurringExpModal.findOneAndUpdate(
        {
          _id: savedEntry.ofRecurring,
          userId, // 🔐 enforce ownership
        },
        {
          $set: { isReccuringStatus: 0 },
        },
        { session }
      );

      if (!recurringUpdated) {
        throw new Error(
          "Recurring expense not found or does not belong to user"
        );
      }
    }

    // If everything succeeded, commit
    await session.commitTransaction();
    res.status(201).json(savedEntry);
  } catch (error) {
    await session.abortTransaction();
    console.error(
      "An error occurred during the Insert Expense Transaction:",
      error
    );
    return res.status(500).json({
      message: error.message || "Failed to Insert Expense transaction",
    });
  } finally {
    session.endSession();
  }
};

export const insertIncome = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    // creating new income
    const userId = req.user.id;
    const data = {
      userId,
      ...req.body,
    };
    const newIncome = new incomeModal(data);
    const savedEntry = await newIncome.save({ session });

    // updating total
    await insertTotal(savedEntry, session);

    // saved income
    await session.commitTransaction();
    res.status(201).json(savedEntry);
  } catch (error) {
    await session.abortTransaction();
    console.error(
      "An error occurred during the Insert Income Transaction:",
      error
    );
    return res.status(500).json({
      message: error.message || "Failed to Insert Income transaction",
    });
  } finally {
    session.endSession();
  }
};

export const insertRecurringExpense = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    // creating new income
    const userId = req.user.id;
    const data = {
      userId,
      ...req.body,
    };

    // Operation 1: Create the recurring expense
    const newRecurring = new recurringExpModal(data);
    const savedRecurringExpense = await newRecurring.save({ session });

    let savedExpense = null; // This will hold the new expense, if created

    // Operation 2: If PAID, create the regular expense
    if (savedRecurringExpense.isReccuringStatus === 0) {
      // Assuming 0 means PAID
      const expenseData = {
        userId: savedRecurringExpense.userId,
        isTypeExpense: savedRecurringExpense.isTypeExpense,
        isNote: savedRecurringExpense.isNote,
        primeCategory: savedRecurringExpense.primeCategory,
        subCategory: savedRecurringExpense.subCategory,
        onDate: savedRecurringExpense.onDate,
        ofAmount: savedRecurringExpense.ofAmount,
        isRecurringExpense: true,
        ofRecurring: savedRecurringExpense._id,
        isTripExpense: false,
        ofTrip: null,
      };
      const newExpense = new expenseModal(expenseData);
      savedExpense = await newExpense.save({ session });
      // update total
      await insertTotal(savedExpense, session);
    }

    // If everything succeeded, commit the transaction
    await session.commitTransaction();

    // Send a complete report back to the client
    res.status(201).json({
      newRecurringExpense: savedRecurringExpense,
      newExpense: savedExpense,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(
      "An error occurred during the Creating Recurring transaction:",
      error
    );
    return res
      .status(500)
      .json({ message: error.message || "Failed to Create Recurring Expense" });
  } finally {
    session.endSession();
  }
};

/**
 * *==================== DELETE Functions ====================
 * @see deleteExpense
 * @see deleteIncome
 * *delete the Expense & Income from DB and return the deleted obj
 */

export const deleteExpense = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    const userId = req.user.id;
    const { expID } = req.params;

    // --- Operation 1: Delete the expense ---
    const expData = await expenseModal.findOneAndDelete(
      { userId, _id: expID },
      { session }
    );
    // Handle "not found" inside the transaction
    if (!expData) {
      // Abort the transaction before sending the response
      await session.abortTransaction();
      return res.status(404).json({ message: "Expense not found." });
    }
    // --- Operation 2: Decrement the totals ---
    await decrementTotal(expData, session);

    await session.commitTransaction();
    res.status(200).json(expData);
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Expense Transaction aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Delete Expense Transaction",
    });
  } finally {
    session.endSession();
  }
};

export const deleteIncome = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    const userId = req.user.id;
    const { incID } = req.params;
    // --- Operation 1: Delete the income ---
    const incData = await incomeModal.findOneAndDelete(
      { userId, _id: incID },
      { session }
    );
    // Handle "not found" inside the transaction
    if (!incData) {
      // Abort the transaction before sending the response
      await session.abortTransaction();
      return res.status(404).json({ message: "Income not found." });
    }
    // --- Operation 2: Decrement the totals ---
    await decrementTotal(userId, incData, session);
    await session.commitTransaction();
    res.status(200).json(incData);
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Income Transaction aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Delete Income Transaction",
    });
  } finally {
    session.endSession();
  }
};

export const deleteRecurringExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recExpID } = req.params;
    // --- Operation 1: Delete the recurring expense ---
    const recData = await recurringExpModal.findOneAndDelete(
      { userId, _id: recExpID },
      { session }
    );
    // Handle "not found" inside the transaction
    if (!recData) {
      // Abort the process before sending the response

      return res.status(404).json({ message: "Recurring Expense not found." });
    }

    res.status(200).json(recData);
  } catch (error) {
    console.error("Delete Recurring Expense Entry aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Delete Recurring Expense Entry",
    });
  }
};

export const deleteTripExpenses = async (tripId, userId, session) => {
  try {
    const exp = await expenseModal
      .find(
        {
          userId,
          ofTrip: tripId,
          isTripExpense: true,
        },
        {
          ofAmount: 1,
          date: 1,
          primeName: 1,
          subName: 1,
        }
      )
      .session(session);

    if (!expenses.length) {
      return 0;
    }

    const yearMap = {};
    for (const exp of expenses) {
      const d = new Date(exp.date);
      const year = d.getFullYear();
      const month = d.getMonth();

      yearMap[year] ??= {
        total: 0,
        months: {},
        primes: {},
        subs: {},
      };

      yearMap[year].total += exp.ofAmount;

      yearMap[year].months[month] =
        (yearMap[year].months[month] || 0) + exp.ofAmount;

      yearMap[year].primes[exp.primeName] =
        (yearMap[year].primes[exp.primeName] || 0) + exp.ofAmount;

      const subKey = `${exp.primeName}|${exp.subName}`;
      yearMap[year].subs[subKey] =
        (yearMap[year].subs[subKey] || 0) + exp.ofAmount;
    }

    for (const year in yearMap) {
      const data = yearMap[year];

      const doc = await totalModal
        .findOne({ userId, year: Number(year), isTripExpense: true })
        .session(session);
      if (!doc) continue;

      /* ---- total ---- */
      doc.total = Math.max(0, doc.total - data.total);

      /* ---- months ---- */
      for (const month in data.months) {
        const entry = doc.monthList.find(m => m.month === Number(month));
        if (entry) {
          entry.total = Math.max(0, entry.total - data.months[month]);
        }
      }

      /* ---- primes ---- */
      for (const primeName in data.primes) {
        const entry = doc.primeList.find(p => p.name === primeName);
        if (entry) {
          entry.total = Math.max(0, entry.total - data.primes[primeName]);
        }
      }
      /* ---- subs ---- */
      for (const key in data.subs) {
        const [primeName, subName] = key.split("|");

        const entry = doc.subList.find(
          s => s.primeName === primeName && s.subName === subName
        );

        if (entry) {
          entry.total = Math.max(0, entry.total - data.subs[key]);
        }
      }

      /* ---- cleanup ---- */
      doc.monthList = doc.monthList.filter(m => m.total > 0);
      doc.primeList = doc.primeList.filter(p => p.total > 0);
      doc.subList = doc.subList.filter(s => s.total > 0);

      if (doc.total === 0) {
        await totalModal.deleteOne({ _id: doc._id }, { session });
      } else {
        await doc.save({ session });
      }
    }

    const res = await expenseModal.deleteMany(
      {
        userId,
        ofTrip: tripId,
        isTripExpense: true,
      },
      { session }
    );

    const count = exp.deletedCount || 0;

    console.log("Trip Expenses Deleted");
    return count;
  } catch (error) {
    console.error("Error occurred in deleting Trip Expenses:", error);
    throw new Error("Failed to Delete Trip Expense.");
  }
};

/**
 * *==================== UPDATE Functions ====================
 */

export const updateExpense = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.user.id;
    const data = req.body;
    let runDispatch = false;
    const exp = await expenseModal.findOneAndUpdate(
      { userId, _id: data._id },
      data,
      { new: false, runValidators: true, timestamps: true, session: session }
    );
    if (!exp) {
      // Abort the transaction before sending the response
      await session.abortTransaction();
      return res.status(404).json({ message: "Expense not found to update." });
    }

    const changeInDate = moment(exp.onDate).isSame(data.onDate, "day");

    if (
      exp.ofAmount !== data.ofAmount ||
      !changeInDate ||
      exp.primeCategory !== data.primeCategory ||
      exp.subCategory !== data.subCategory
    ) {
      await decrementTotal(userId, exp, session);
      await insertTotal(userId, data, session);
      runDispatch = true;
    }
    await session.commitTransaction();
    res.status(200).json({ update: true, runDispatch: runDispatch });
  } catch (error) {
    await session.abortTransaction();
    console.error("Update Expense Transaction aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Update Expense Transaction",
    });
  } finally {
    session.endSession();
  }
};
export const updateIncome = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.user.id;
    const data = req.body;
    let runDispatch = false;
    const inc = await incomeModal.findOneAndUpdate(
      { userId, _id: data._id },
      data,
      { new: false, runValidators: true, timestamps: true, session: session }
    );
    if (!inc) {
      // Abort the transaction before sending the response
      await session.abortTransaction();
      return res.status(404).json({ message: "Income not found to update." });
    }
    const changeInDate = moment(inc.onDate).isSame(data.onDate, "day");
    if (
      inc.ofAmount !== data.ofAmount ||
      !changeInDate ||
      inc.primeCategory !== data.primeCategory ||
      inc.subCategory !== data.subCategory
    ) {
      await decrementTotal(userId, inc, session);
      await insertTotal(userId, data, session);
      runDispatch = true;
    }
    await session.commitTransaction();
    res.status(200).json({ update: true, runDispatch: runDispatch });
  } catch (error) {
    await session.abortTransaction();
    console.error("Update Income Transaction aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Update Income Transaction",
    });
  } finally {
    session.endSession();
  }
};
export const updateRecurringExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const recExp = await recurringExpModal.findOneAndUpdate(
      { userId, _id: data._id },
      data,
      { new: false, runValidators: true, timestamps: true, session: session }
    );
    if (!recExp) {
      // Abort the transaction before sending the response

      return res
        .status(404)
        .json({ message: "Recurring Expense Entry not found to update." });
    }

    res.status(200).json({ update: true });
  } catch (error) {
    console.error("Update Recurring Expense Entry aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Update Recurring Expense Entry",
    });
  }
};
