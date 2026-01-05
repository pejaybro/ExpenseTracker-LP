/* REVIEW - modal is the database design to store value
 ** NOTE - it will be used inside controller when injecting the data in DB
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      require: true,
    },
    isTypeExpense: {
      type: Boolean,
      index: true,
      required: true,
    },
    ofAmount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive Number"],
    },
    isNote: {
      type: String,
      default: null,
    },
    primeCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    onDate: {
      type: Date,
      required: true,
    },
    isTripExpense: {
      type: Boolean,
      index: true,
      required: true,
    },

    ofTrip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      index: true,
      required: function () {
        return this.isTripExpense === true; // only required if it's a recurring expense
      },
      default: null,
    },
    isRecurringExpense: {
      type: Boolean,
      index: true,
      required: true,
    },
    ofRecurring: {
      type: Schema.Types.ObjectId,
      ref: "RecurringExpense",
      index: true,
      default: null,
      required: function () {
        return this.isRecurringExpense === true; // only required if it's a recurring expense
      },
    },
  },
  {
    collection: "default-expense", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
    strict: true, // only allow schema-defined + timestamps
  }
);

const incomeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      require: true,
    },
    isTypeExpense: {
      type: Boolean,
      index: true,
      required: true,
    },
    ofAmount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive Number"],
    },
    isNote: {
      type: String,
      default: null,
    },
    primeCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    onDate: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "default-income", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
    strict: true, // only allow schema-defined + timestamps
  }
);

const recurringExpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      require: true,
    },
    isTypeExpense: {
      type: Boolean,
      required: true,
    },
    isReccuringBy: {
      type: Number,
      index: true,
      required: true,
      enum: {
        values: [1, 2],
        message: "repeatBy must be either 1 or 2",
      },
    },
    isReccuringStatus: {
      type: Number,
      index: true,
      required: true,
      enum: {
        values: [0, 1, 2, 3, 4],
        message: "Repeat Status must be btwn 0,1,2,3 or 4",
      },
    },
    ofAmount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive Number"],
    },
    isNote: {
      type: String,
      default: null,
    },
    primeCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    onDate: {
      type: Date,
      required: true,
    },
    lastPaymentDate: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "default-recurring", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
    strict: true, // only allow schema-defined + timestamps
  }
);

/* //NOTE indexing the valid object this is the correct way for nested object
expenseSchema.index({ "isTransactionTrip.valid": 1 });
expenseSchema.index({ "isTransactionRepeating.valid": 1 }); */

const expenseModal = mongoose.model("Expense", expenseSchema);
const recurringExpModal = mongoose.model(
  "RecurringExpense",
  recurringExpSchema
);
const incomeModal = mongoose.model("Income", incomeSchema);
export { expenseModal, recurringExpModal, incomeModal };
