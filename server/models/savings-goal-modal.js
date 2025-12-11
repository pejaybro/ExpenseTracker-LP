import mongoose from "mongoose";

const Schema = mongoose.Schema;

const goalLog = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive Number"],
    },
  },
  {
    timestamps: true,
    strict: true, // only allow schema-defined + timestamps
  }
);

const goalSchema = new Schema(
  {
    userID: {
      type: Number,
      required: true,
      index: true,
      unique: false,
    },
    log: {
      type: [goalLog],
      required: true,
      default: [],
    },
    ofAmount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive Number"],
    },
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      index: true,
      required: true,
    },
    endDate: {
      index: true,
      type: Date,
    },
  },
  {
    collection: "default-savings-goal", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
    strict: true, // only allow schema-defined + timestamps
  }
);
export const savingsGoalModal = mongoose.model("SavingsGoal", goalSchema);
