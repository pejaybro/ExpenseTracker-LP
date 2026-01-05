/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";
const totalValidation = [
  // vailidate year
  body("year").isInt().withMessage("Enter a valid year").toInt(),

  // vailidate is exp or inc
  body("isTypeExpense")
    .isBoolean()
    .withMessage("isTypeExpense Type must be boolen"),

  // vailidate total in all year
  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number")
    .toFloat(),

  ,
  // Validate monthList array
  body("monthList").isArray().withMessage("monthList must be an array"),
  body("monthList.*.month")
    .isInt({ min: 0, max: 11 })
    .withMessage("month must be between 0 and 11")
    .toInt(),
  body("monthList.*.total")
    .isFloat({ min: 0 })
    .withMessage("month total must be a positive number")
    .toFloat(),

  // Validate primeList array
  body("primeList").isArray().withMessage("primeList must be an array"),
  body("primeList.*.name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("primeList.name is required"),
  body("primeList.*.total")
    .isFloat({ min: 0 })
    .withMessage("primeList.total must be a number")
    .toFloat(),

  ,
  // Validate subList array
  body("subList").isArray().withMessage("subList must be an array"),
  body("subList.*.primeName")
    .isString()
    .notEmpty()
    .withMessage("subList.primeName is required"),
  body("subList.*.subName")
    .isString()
    .notEmpty()
    .withMessage("subList.subName is required"),
  body("subList.*.total")
    .isFloat({ min: 0 })
    .withMessage("subList.total must be a number")
    .toFloat(),

  // Middleware function to check validation errors
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

export { totalValidation };
