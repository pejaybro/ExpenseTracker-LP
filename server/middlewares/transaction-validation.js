/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";

const expenseValidation = [
  // Validate userID: must exist, not be empty, and be a number
  body("userID")
    .exists()
    .withMessage("User ID is required")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .isNumeric()
    .withMessage("User ID must be a numeric value"),

  // Validate transaction type: must exist, not be empty, and be boolean
  body("isTypeExpense")
    .exists()
    .withMessage("Transaction type is required")
    .notEmpty()
    .withMessage("Transaction type cannot be empty")
    .isBoolean()
    .withMessage("Transaction type must be a boolean value"),

  // Validate transaction date: must exist, not be empty, and follow ISO 8601 format
  body("onDate")
    .exists()
    .withMessage("Transaction date is required")
    .notEmpty()
    .withMessage("Transaction date cannot be empty")
    .isISO8601()
    .withMessage("Transaction date must be in ISO 8601 format"),

  // Validate transaction amount: must exist, not be empty, be numeric, and >= 0
  body("ofAmount")
    .exists()
    .withMessage("Transaction amount is required")
    .notEmpty()
    .withMessage("Transaction amount cannot be empty")
    .isNumeric()
    .withMessage("Transaction amount must be a number")
    .custom(value => value >= 0)
    .withMessage("Transaction amount must be a positive number"),

  // Validate note: optional, but if present must be a string
   body("isNote").optional(),

  // Validate primary category: must exist, not be empty, and be a string
  body("primeCategory")
    .exists()
    .withMessage("Primary category is required")
    .notEmpty()
    .withMessage("Primary category cannot be empty")
    .isString()
    .withMessage("Primary category must be a string"),

  // Validate sub-category: must exist, not be empty, and be a string
  body("subCategory")
    .exists()
    .withMessage("Sub-category is required")
    .notEmpty()
    .withMessage("Sub-category cannot be empty")
    .isString()
    .withMessage("Sub-category must be a string"),

  // Validate Trip type: must exist, not be empty, and be boolean
  body("isTripExpense")
    .exists()
    .withMessage("Trip type is required")
    .notEmpty()
    .withMessage("Trip type cannot be empty")
    .isBoolean()
    .withMessage("Trip type must be a boolean value"),

  // validation for if exp is trip then
  body("ofTrip").custom((value, { req }) => {
    if (req.body.isTripExpense) {
      if (!value) {
        throw new Error(
          "Trip ID (ofTrip) is required when isTripExpense is true"
        );
      }
    }
    return true;
  }),

  // Validate Recurring type: must exist, not be empty, and be boolean
  body("isRecurringExpense")
    .exists()
    .withMessage("Recurring Expense type is required")
    .notEmpty()
    .withMessage("Recurring type cannot be empty")
    .isBoolean()
    .withMessage("Recurring type must be a boolean value"),

  // validation for if exp is Recurring then
  body("ofRecurring").custom((value, { req }) => {
    if (req.body.isRecurringExpense) {
      if (!value) {
        throw new Error(
          "Recurring ID (ofRecurring) is required when isRecurringExpense is true"
        );
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
  // userID
  body("userID")
    .exists()
    .withMessage("User ID is required")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .isNumeric()
    .withMessage("User ID must be a number"),

  // isTypeExpense
  body("isTypeExpense")
    .exists()
    .withMessage("Transaction type is required")
    .isBoolean()
    .withMessage("Transaction type must be boolean"),

  // isReccuringBy (must be 1 or 2)
  body("isReccuringBy")
    .exists()
    .withMessage("Repeat By is required")
    .isIn([1, 2])
    .withMessage("Repeat By must be either 1 or 2"),

  // isReccuringStatus (must be 0, 1, 2, 3, 4)
  body("isReccuringStatus")
    .exists()
    .withMessage("Repeat Status is required")
    .isIn([0, 1, 2, 3, 4])
    .withMessage("Repeat Status must be between 0 and 4"),

  // ofAmount (must be >= 0)
  body("ofAmount")
    .exists()
    .withMessage("Transaction amount is required")
    .isNumeric()
    .withMessage("Transaction amount must be a number")
    .custom(value => value >= 0)
    .withMessage("Transaction amount must be positive"),

  // isNote (optional string)
   body("isNote").optional(),

  // primeCategory
  body("primeCategory")
    .exists()
    .withMessage("Primary category is required")
    .isString()
    .withMessage("Primary category must be a string"),

  // subCategory
  body("subCategory")
    .exists()
    .withMessage("Sub category is required")
    .isString()
    .withMessage("Sub category must be a string"),

  // onDate
  body("onDate")
    .exists()
    .withMessage("Transaction date is required")
    .isISO8601()
    .withMessage("Transaction date must be in ISO format"),

  // lastPaymentDate
  body("lastPaymentDate")
    .exists()
    .withMessage("Last payment date is required")
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
  // Validate userID: must exist, not be empty, and be numeric
  body("userID")
    .exists()
    .withMessage("User ID is required")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .isNumeric()
    .withMessage("User ID must be a numeric value"),

  // Validate transaction type: must exist, not be empty, and be boolean
  body("isTypeExpense")
    .exists()
    .withMessage("Transaction type is required")
    .notEmpty()
    .withMessage("Transaction type cannot be empty")
    .isBoolean()
    .withMessage("Transaction type must be a boolean value"),

  // Validate transaction date: must exist, not be empty, and follow ISO 8601 format
  body("onDate")
    .exists()
    .withMessage("Income transaction date is required")
    .notEmpty()
    .withMessage("Income transaction date cannot be empty")
    .isISO8601()
    .withMessage("Income transaction date must be in ISO 8601 format"),

  // Validate amount: must exist, not be empty, be numeric, and >= 0
  body("ofAmount")
    .exists()
    .withMessage("Transaction amount is required")
    .notEmpty()
    .withMessage("Transaction amount cannot be empty")
    .isNumeric()
    .withMessage("Transaction amount must be a number")
    .custom(value => value >= 0)
    .withMessage("Transaction amount must be a positive number"),

  // Validate note: optional, but must be a string if provided
  body("isNote").optional(),

  // Validate primary category: must exist, not be empty, and be a string
  body("primeCategory")
    .exists()
    .withMessage("Primary category is required")
    .notEmpty()
    .withMessage("Primary category cannot be empty")
    .isString()
    .withMessage("Primary category must be a string"),

  // Validate sub-category: must exist, not be empty, and be a string
  body("subCategory")
    .exists()
    .withMessage("Sub-category is required")
    .notEmpty()
    .withMessage("Sub-category cannot be empty")
    .isString()
    .withMessage("Sub-category must be a string"),

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
