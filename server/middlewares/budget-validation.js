/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";

export const NewBudget = [
  // year must exist, not empty, numeric, and >= 2000
  body("year").isInt().withMessage("year cannot be empty").toInt(),
  // Validate each item inside budgetList
  body("month")
    .isInt({ min: 0, max: 11 })
    .withMessage("month must be between 1 and 12")
    .toInt(),
  // budget amount validation
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("budget amount must be a positive number")
    .toFloat(),

  // Middleware function to check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("New Budget Validation Errors:", errors.array());
      return res.status(400).json({
        message: "New Budget Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];
