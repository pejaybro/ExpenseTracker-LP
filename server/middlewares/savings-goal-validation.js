import { body, validationResult } from "express-validator";

export const goalValivation = [
  // title validation
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("title length must be 1–200 characters"),
  // goal amount validation
  body("ofAmount")
    .isFloat({ min: 0 })
    .withMessage("ofAmount must be a positive number")
    .toFloat(),
  // is completed or active validation
  body("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be a boolean"),
  // start goal on validation
  body("startDate")
    .isISO8601()
    .withMessage("startDate must be a valid ISO8601 date"),
  // end goal on validation
  body("endDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("endDate must be a valid ISO8601 date")
    .custom((value, { req }) => {
      if (!value) return true;
      const start = new Date(req.body.startDate);
      const end = new Date(value);
      if (Number.isNaN(start.getTime())) {
        throw new Error("startDate is invalid");
      }
      if (end <= start) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),
  // list of entries made in goal validation
  body("log")
    .optional()
    .isArray()
    .withMessage("log must be an array")
    .custom(arr => {
      for (const item of arr) {
        if (typeof item !== "object" || item === null) {
          throw new Error("each log entry must be an object");
        }
        if (!("amount" in item)) {
          throw new Error("each log entry must contain amount");
        }
        const amount = Number(item.amount);
        if (Number.isNaN(amount) || amount < 0) {
          throw new Error("log.amount must be a number >= 0");
        }
      }
      return true;
    }),
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
