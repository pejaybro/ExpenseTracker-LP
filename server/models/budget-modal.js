/* REVIEW - modal is the database design to store value
 ** NOTE - it will be used inside controller when injecting the data in DB
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const budgetlist = new Schema(
  {
    month: { type: Number, required: true, index: true, min: 0, max: 11 },
    budget: { type: Number, required: true, min: 0 },
  },
  { _id: false, timestamps: true }
);
const budgetSchema = new Schema(
  {
    userID: {
      type: Number,
      required: true,
      index: true,
      unique: false,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    budgetList: [budgetlist],
  },
  {
    collection: "default-budget",
    // NOTE - this line overrides pluralization of adding "s" at last of collection name

    timestamps: true,
  }
);
budgetSchema.index({ userID: 1, year: 1 }, { unique: true });

const budgetModal = mongoose.model("default-budget", budgetSchema);
export { budgetModal };
