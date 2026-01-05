import { totalModal } from "../models/total-modal.js";
import moment from "moment";
import { updateTripTotal } from "./trip-controller.js";

/**
 * @see insertTotal - add the transaction amount in total DB
 * @see decrementTotal - subtracts the transaction amount in total DB
 * @param {object} entry - data obj of transaction used update total DB
 * @param {import('mongoose').ClientSession} session -  to be sure that db updates without error if so then whole process will fail so that data remain persistant
 * @throws {Error} Throws an error if the database update fails.
 * @see fetchTotal - fetches the total DB data
 */

export const insertTotal = async (userId,entry, session) => {
  try {
    const {
      
      isTypeExpense,
      ofAmount,
      onDate,
      primeCategory,
      subCategory,
    } = entry;

    const year = moment(onDate).year();
    const month = moment(onDate).month();

    // --- Step 1: Upsert the main document and increment the top-level total ---
    await totalModal.updateOne(
      { userId, year, isTypeExpense },
      {
        $inc: { total: ofAmount },
        $setOnInsert: {
          userId,
          year,
          isTypeExpense,
          monthList: [],
          primeList: [],
          subList: [],
        },
      },
      { upsert: true, session }
    );

    // --- Step 2: Handle the 'monthList' update ---
    // First, try to increment the total if the month already exists.
    const monthUpdateResult = await totalModal.updateOne(
      { userId, year, isTypeExpense, "monthList.month": month },
      { $inc: { "monthList.$.total": ofAmount } },
      { session }
    );

    // If nothing was updated, it means the month didn't exist. Now, we push it.
    if (monthUpdateResult.modifiedCount === 0) {
      await totalModal.updateOne(
        { userId, year, isTypeExpense },
        { $push: { monthList: { month, total: ofAmount } } },
        { session }
      );
    }

    // --- Step 3: Handle the 'primeList' update (repeat the pattern) ---
    const primeUpdateResult = await totalModal.updateOne(
      { userId, year, isTypeExpense, "primeList.name": primeCategory },
      { $inc: { "primeList.$.total": ofAmount } },
      { session }
    );

    if (primeUpdateResult.modifiedCount === 0) {
      await totalModal.updateOne(
        { userId, year, isTypeExpense },
        { $push: { primeList: { name: primeCategory, total: ofAmount } } },
        { session }
      );
    }

    // --- Step 4: Handle the 'subList' update (repeat the pattern) ---
    const subUpdateResult = await totalModal.updateOne(
      { userId, year, isTypeExpense, "subList.subName": subCategory },
      { $inc: { "subList.$.total": ofAmount } },
      { session }
    );

    if (subUpdateResult.modifiedCount === 0) {
      await totalModal.updateOne(
        { userId, year, isTypeExpense },
        {
          $push: {
            subList: {
              primeName: primeCategory,
              subName: subCategory,
              total: ofAmount,
            },
          },
        },
        { session }
      );
    }

    console.log("Totals updated correctly.");
  } catch (error) {
    console.error("Error occurred in insertTotal:", error);
    throw new Error("Failed to update total breakdown.");
  }
};

export const decrementTotal = async (userId,entry, session) => {
  try {
    const {      
      isTypeExpense,
      ofAmount,
      onDate,
      primeCategory,
      subCategory,
      isTripExpense,
    } = entry;

    const year = moment(onDate).year();
    const month = moment(onDate).month();

    // 1. Find the document within the transaction
    const doc = await totalModal
      .findOne({ userId, year, isTypeExpense })
      .session(session);
    // If there's no document to update, we can safely exit.
    if (!doc) {
      console.log("No total document found to decrement for this year.");
      return;
    }

    // 2. Perform the safe decrements using Math.max()
    doc.total = Math.max(0, doc.total - ofAmount);

    const monthEntry = doc.monthList.find(m => m.month === month);
    if (monthEntry) {
      monthEntry.total = Math.max(0, monthEntry.total - ofAmount);
    }

    const primeEntry = doc.primeList.find(p => p.name === primeCategory);
    if (primeEntry) {
      primeEntry.total = Math.max(0, primeEntry.total - ofAmount);
    }

    const subEntry = doc.subList.find(s => s.subName === subCategory);
    if (subEntry) {
      subEntry.total = Math.max(0, subEntry.total - ofAmount);
    }

    doc.monthList = doc.monthList.filter(item => item.total > 0);
    doc.primeList = doc.primeList.filter(item => item.total > 0);
    doc.subList = doc.subList.filter(item => item.total > 0);

    if (doc.total === 0) {
      // If the grand total is now zero, delete the entire document for that year.
      await totalModal.deleteOne(
        { userId, _id: doc._id },
        { session }
      );
      console.log("Yearly total document was empty and has been deleted.");
    } else {
      // Otherwise, just save the updates.
      await doc.save({ session });
      console.log("Totals decremented and pruned successfully.");
    }

    if (isTripExpense === true) updateTripTotal(0, entry, session);
  } catch (error) {
    console.error("Error occurred in decrementTotal:", error);
    throw new Error("Failed to decrement total breakdown.");
  }
};

export const fetchTotal = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await totalModal.find({ userId });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Fetch Total" });
  }
};

/**
 * Creates a MongoDB aggregation expression to safely decrement a field,
 * preventing it from going below zero.
 * @method decrementBy()
 * @param {string} fieldPath - The path to the field to decrement (e.g., "$total").
 * @param {number} amountToSubtract - The amount to subtract.
 * @returns {object} The MongoDB $cond expression.
 */
const decrementBy = (fieldPath, amountToSubtract) => {
  return {
    $cond: {
      if: { $gte: [fieldPath, amountToSubtract] },
      then: { $subtract: [fieldPath, amountToSubtract] },
      else: fieldPath, // If subtraction would go negative, keep original value
    },
  };
};
