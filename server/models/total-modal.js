/* REVIEW - modal is the database design to store value
 ** NOTE - it will be used inside controller when injecting the data in DB
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const monthList = new Schema(
  {
    month: { type: Number, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);
const primeList = new Schema(
  {
    name: { type: String, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);
const subList = new Schema(
  {
    primeName: { type: String, required: true, index: true },
    subName: { type: String, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);
const totalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      require: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    isTypeExpense: {
      type: Boolean,
      index: true,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    monthList: [monthList],
    primeList: [primeList],
    subList: [subList],
  },
  {
    collection: "default-total", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
  }
);
totalSchema.index({ userId: 1, year: 1, isTypeExpense: 1 }, { unique: true });

const totalModal = mongoose.model("default-total", totalSchema);
export { totalModal };
