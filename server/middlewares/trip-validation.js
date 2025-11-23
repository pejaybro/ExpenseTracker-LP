/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";

const tripValidation = [
  // userID must exist, must not be empty, and must be a number
  body("userID")
    .exists()
    .withMessage("userID is required")
    .notEmpty()
    .withMessage("userID cannot be empty")
    .isNumeric()
    .withMessage("userID must be a number"),

  // tripType must exist, must be 0 or 1
  body("tripType")
    .exists()
    .withMessage("tripType is required")
    .notEmpty()
    .withMessage("tripType cannot be empty")
    .isIn([0, 1])
    .withMessage("tripType must be either 0 (Domestic) or 1 (International)"),

  // abroadInfo validation → only if tripType = 1 (International)
  body("abroadInfo").custom((value, { req }) => {
    if (req.body.tripType === 1) {
      if (!value) {
        throw new Error("abroadInfo is required for international trips");
      }
      if (!value.country)
        throw new Error("country name is required in abroadInfo");
      if (!value.currency)
        throw new Error("currency name is required in abroadInfo");
      if (!value.currencyCode)
        throw new Error("Currency Code is required in abroadInfo");
      if (value.rate !== undefined && typeof value.rate !== "number") {
        throw new Error("rate must be a number in abroadInfo");
      }
    }
    return true;
  }),

  // travelType must exist, must be 0–3
  body("travelType")
    .exists()
    .withMessage("travelType is required")
    .notEmpty()
    .withMessage("travelType cannot be empty")
    .isIn([0, 1, 2, 3])
    .withMessage(
      "travelType must be 0 (Solo), 1 (Solo Family), 2 (Group), or 3 (Group of Families)"
    ),

  // startOn must be a valid date
  body("startOn")
    .exists()
    .withMessage("startOn is required")
    .notEmpty()
    .withMessage("startOn cannot be empty")
    .isISO8601()
    .withMessage("startOn must be a valid ISO date"),

  // endsOn must be a valid date and after startOn
  body("endsOn")
    .exists()
    .withMessage("endsOn is required")
    .notEmpty()
    .withMessage("endsOn cannot be empty")
    .isISO8601()
    .withMessage("endsOn must be a valid ISO date")
    .custom((value, { req }) => {
      const start = new Date(req.body.startOn);
      const end = new Date(value);

      if (end < start) {
        throw new Error("endsOn must be the same as or after startOn");
      }
      return true;
    }),

  // tripTitle must exist, not empty, and should be a trimmed string
  body("tripTitle")
    .exists()
    .withMessage("tripTitle is required")
    .notEmpty()
    .withMessage("tripTitle cannot be empty")
    .isString()
    .withMessage("tripTitle must be text")
    .trim(),
  body("ofGroup")
    .notEmpty()
    .withMessage("Group size is required")
    .isInt({ min: 1 })
    .withMessage("Group size must be at least 1")
    .toInt(), // converts string to number
  body("tripTotal")
    .optional() // allow missing, since default = 0
    .isNumeric()
    .withMessage("Trip total must be a number")
    .isFloat({ min: 0 })
    .withMessage("Trip total cannot be negative"),
  body("tripHashData").optional().isString().trim(),
  body("tripSummary").optional().isString().trim(),

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

export { tripValidation };
