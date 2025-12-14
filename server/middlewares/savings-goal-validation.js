import { body, validationResult } from "express-validator";

export const goalValivation = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("title length must be 1-200 characters"),
  body("ofAmount")
    .exists()
    .withMessage("ofAmount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("ofAmount must be a positive number"),
  body("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be a boolean"),

  body("startDate")
    .exists()
    .withMessage("startDate is required")
    .bail()
    .isISO8601()

    .withMessage("startDate must be a valid ISO8601 date"),

  body("endDate")
    .optional({ nullable: true })
    .isISO8601()

    .withMessage("endDate must be a valid ISO8601 date")
    .bail()
    .custom((value, { req }) => {
      if (!value) return true;
      const start = new Date(req.body.startDate);
      if (!(start instanceof Date) || Number.isNaN(start.getTime()))
        throw new Error("startDate is invalid");
      if (new Date(value) <= start)
        throw new Error("endDate must be after startDate");
      return true;
    }),
  body("log")
    .optional()
    .isArray()
    .withMessage("log must be an array")
    .bail()
    .custom(arr => {
      if (!Array.isArray(arr)) return false;
      for (const item of arr) {
        if (typeof item !== "object" || item === null) return false;
        if (!("amount" in item)) return false;
        const n = Number(item.amount);
        if (Number.isNaN(n) || n < 0) return false;
      }
      return true;
    })
    .withMessage("each log entry must contain an amount >= 0"),
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
