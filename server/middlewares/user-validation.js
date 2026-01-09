import { body, validationResult } from "express-validator";

export const signupValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3 to 30 characters")
    .matches(/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]+$/)
    .withMessage(
      "Username can contain lowercase letters, numbers, dots and underscores only"
    )
    .toLowerCase(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("password")
    .optional({ nullable: true })
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be 2 to 50 characters"),
  body("provider")
    .optional()
    .isIn(["local", "google"])
    .withMessage("Invalid auth provider"),
  body("profilePicture").optional({ nullable: true }).isString(),
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

export const loginValidation = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required")
    .custom(value => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      const isUsername = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]+$/.test(value);

      if (!isEmail && !isUsername) {
        throw new Error("Enter a valid email or username");
      }
      return true;
    })
    .toLowerCase(),

  body("password").notEmpty().withMessage("Password is required"),
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
