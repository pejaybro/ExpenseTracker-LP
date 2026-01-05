/* REVIEW - modal is the database design to store value
 ** NOTE - it will be used inside controller when injecting the data in DB
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const minmaxMonth = new Schema(
  {
    month: { type: Number, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);
const minmaxPrime = new Schema(
  {
    name: { type: String, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);
const minmaxSub = new Schema(
  {
    primeName: { type: String, required: true, index: true },
    subName: { type: String, required: true, index: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const minmaxSchema = new Schema(
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
    maxMonth: {
      type: minmaxMonth,
      required: true,
    },
    minMonth: {
      type: minmaxMonth,
      required: true,
    },
    maxPrime: {
      type: minmaxPrime,
      required: true,
    },
    minPrime: {
      type: minmaxPrime,
      required: true,
    },
    maxSub: { type: minmaxSub, required: false, default: null }, // no longer [minmaxSub]
    minSub: { type: minmaxSub, required: false, default: null },
  },
  {
    collection: "default-minmax", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
  }
);
minmaxSchema.index({ userID: 1, year: 1, isTypeExpense: 1 }, { unique: true });

const minmaxModal = mongoose.model("MinMax", minmaxSchema);
export { minmaxModal };
