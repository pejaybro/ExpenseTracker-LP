/* REVIEW - validation must check the incoming values
 ** NOTE - after chacking the value it will then pass to controller
 */

import { body, validationResult } from "express-validator";

const tripValidation = [
  // tripType must exist, must be 0 or 1
  body("tripType")
    .isInt({ min: 0, max: 1 })
    .withMessage("tripType must be 0 (Domestic) or 1 (International)")
    .toInt(),

  // abroadInfo validation → only if tripType = 1 (International)
  body("abroadInfo").custom((value, { req }) => {
    if (req.body.tripType === 1) {
      if (!value || typeof value !== "object") {
        throw new Error("abroadInfo is required for international trips");
      }
      const { country, currency, currencyCode, rate } = value;

      if (!country || typeof country !== "string") {
        throw new Error("country is required in abroadInfo");
      }
      if (!currency || typeof currency !== "string") {
        throw new Error("currency is required in abroadInfo");
      }
      if (!currencyCode || typeof currencyCode !== "string") {
        throw new Error("currencyCode is required in abroadInfo");
      }
      if (rate !== undefined && typeof rate !== "number") {
        throw new Error("rate must be a number in abroadInfo");
      }
    }
    // If domestic trip, abroadInfo should not be forced
    return true;
  }),

  // travelType must exist, must be 0–3
  body("travelType")
    .isIn([0, 1, 2, 3])
    .withMessage(
      "travelType must be 0 (Solo), 1 (Solo Family), 2 (Group), or 3 (Group of Families)"
    )
    .toInt(),

  // startOn must be a valid date
  body("startOn").isISO8601().withMessage("startOn must be a valid ISO date"),

  // endsOn must be a valid date and after startOn
  body("endsOn")
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
  body("tripTitle").isString().withMessage("tripTitle must be text").trim(),
  body("ofGroup")
    .isInt({ min: 1 })
    .withMessage("Group size must be at least 1")
    .toInt(), // converts string to number
  body("tripTotal")
    .optional() // allow missing, since default = 0

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
