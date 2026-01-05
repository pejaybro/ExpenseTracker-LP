/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";

const expenseValidation = [
  // Validate transaction type: must exist, not be empty, and be boolean
  body("isTypeExpense")
    .isBoolean()
    .withMessage("Transaction type must be a boolean value"),

  // Validate transaction date: must exist, not be empty, and follow ISO 8601 format
  body("onDate")
    .isISO8601()
    .withMessage("Transaction date must be in ISO 8601 format"),

  // Validate transaction amount: must exist, not be empty, be numeric, and >= 0
  body("ofAmount")
    .isFloat({ min: 0 })
    .withMessage("Transaction amount must be a positive number")
    .toFloat(),

  // Validate note: optional, but if present must be a string
  body("isNote")
    .optional({ nullable: true })
    .isString()
    .withMessage("Note must be a string"),

  // Validate primary category: must exist, not be empty, and be a string
  body("primeCategory")
    .isString()
    .withMessage("Primary category must be a string"),

  // Validate sub-category: must exist, not be empty, and be a string
  body("subCategory").isString().withMessage("Sub-category must be a string"),

  // Validate Trip type: must exist, not be empty, and be boolean
  body("isTripExpense")
    .isBoolean()
    .withMessage("Trip type must be a boolean value"),

  // validation for if exp is trip then
  body("ofTrip")
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (req.body.isTripExpense) {
        if (!value) {
          throw new Error(
            "Trip ID (ofTrip) is required when isTripExpense is true"
          );
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Invalid Trip ObjectId");
        }
      }
      return true;
    }),

  // Validate Recurring type: must exist, not be empty, and be boolean
  body("isRecurringExpense")
    .isBoolean()
    .withMessage("Recurring type must be a boolean value"),

  // validation for if exp is Recurring then
  body("ofRecurring")
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (req.body.isRecurringExpense) {
        if (!value) {
          throw new Error(
            "Recurring ID (ofRecurring) is required when isRecurringExpense is true"
          );
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Invalid RecurringExpense ObjectId");
        }
      }
      return true;
    }),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  },
];

const recurringValidation = [
  // isTypeExpense
  body("isTypeExpense")
    .isBoolean()
    .withMessage("Transaction type must be boolean"),

  // isReccuringBy (must be 1 or 2)
  body("isReccuringBy")
    .isIn([1, 2])
    .withMessage("Repeat By must be either 1 or 2"),

  // isReccuringStatus (must be 0, 1, 2, 3, 4)
  body("isReccuringStatus")
    .isIn([0, 1, 2, 3, 4])
    .withMessage("Repeat Status must be between 0 and 4"),

  // ofAmount (must be >= 0)
  body("ofAmount")
    .isFloat({ min: 0 })
    .withMessage("Transaction amount must be a positive number")
    .toFloat(),

  // isNote (optional string)
  body("isNote")
    .optional({ nullable: true })
    .isString()
    .withMessage("Note must be a string"),

  // primeCategory
  body("primeCategory")
    .isString()
    .withMessage("Primary category must be a string"),

  // subCategory
  body("subCategory").isString().withMessage("Sub category must be a string"),

  // onDate
  body("onDate")
    .isISO8601()
    .withMessage("Transaction date must be in ISO format"),

  // lastPaymentDate
  body("lastPaymentDate")
    .isISO8601()
    .withMessage("Last payment date must be in ISO format"),

  // Middleware to handle errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  },
];

const incomeValidation = [
  // Validate transaction type: must exist, not be empty, and be boolean
  body("isTypeExpense")
    .isBoolean()
    .withMessage("Transaction type must be a boolean value"),

  // Validate transaction date: must exist, not be empty, and follow ISO 8601 format
  body("onDate")
    .isISO8601()
    .withMessage("Income transaction date must be in ISO 8601 format"),

  // Validate amount: must exist, not be empty, be numeric, and >= 0
  body("ofAmount")
    .isFloat({ min: 0 })
    .withMessage("Transaction amount must be a positive number")
    .toFloat(),

  // Validate note: optional, but must be a string if provided
  body("isNote")
    .optional({ nullable: true })
    .isString()
    .withMessage("Note must be a string"),

  // Validate primary category: must exist, not be empty, and be a string
  body("primeCategory")
    .isString()
    .withMessage("Primary category must be a string"),

  // Validate sub-category: must exist, not be empty, and be a string
  body("subCategory").isString().withMessage("Sub-category must be a string"),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  },
];

export { expenseValidation, recurringValidation, incomeValidation };
