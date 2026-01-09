import express from "express";

import { avatarUpload } from "../controllers/avatar-controller.js";
import { upload } from "../middlewares/multer.js";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/user-validation.js";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
} from "../controllers/availability-controller.js";
import {
  fetchMe,
  resendSignupOtp,
  signup,
  verifySignupOtp,
  login,
  googleCallback,
  verifyPasswordReset,
  resetPassword,
  newPassword, // ✅ make sure this is imported
} from "../controllers/auth-controller.js";
import { protect } from "../middlewares/auth.js";
import passport from "passport";

export const userRouter = express.Router();

/* ---------------------------
   Avatar
--------------------------- */
userRouter.post(
  "/avatar-upload",
  protect,
  upload.single("avatar"),
  avatarUpload
);

/* ---------------------------
   Auth
--------------------------- */
userRouter.post("/signup", signupValidation, signup);
userRouter.post("/login", loginValidation, login); // ✅ FIXED
userRouter.get("/me", protect, fetchMe);

/* ---------------------------
   Signup verification
--------------------------- */
userRouter.post("/verify", verifySignupOtp);
userRouter.post("/resend-code", resendSignupOtp);

/* ---------------------------
   Availability checks
--------------------------- */
userRouter.get("/check-username", checkUsernameAvailability);
userRouter.get("/check-email", checkEmailAvailability);

/* ---------------------------
   Password Reset
--------------------------- */

userRouter.post("/reset-password", resetPassword);
userRouter.post("/verify-password-reset", verifyPasswordReset);
userRouter.post("/new-password", newPassword);

/* ---------------------------
   Google
--------------------------- */

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  googleCallback
);
