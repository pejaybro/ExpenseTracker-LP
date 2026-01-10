import { userModal } from "../models/user-modal.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/email/send-user-otp.js";
import { generateVerificationCode } from "../utils/generateOtp.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    // 1 check username & email existence again

    const exists = await userModal.exists({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });
    if (exists) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    // 2️⃣ Generate OTP
    const otp = generateVerificationCode();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3️⃣ Create user (password hashing handled by model)
    const user = await userModal.create({
      username,
      fullname: fullname,
      email,
      password,
      isVerified: false,
      verificationCode: hashedOtp,
      verificationExpires: otpExpiry,
    });

    // 4️⃣ Send OTP email
    await sendVerificationEmail({
      to: email,
      name: username,
      code: otp,
    });
    return res.status(201).json({
      message: "Verification code sent to email",
      email: user.email,
    });
  } catch (error) {
    // Duplicate index fallback
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Signup failed",
    });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    // 1️⃣ Hash the OTP entered by user
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    // 2️⃣ Find user (unverified)
    const user = await userModal
      .findOne({
        email: email.toLowerCase(),
        isVerified: false,
      })
      .select("+verificationCode +verificationExpires");

    // 🔴 Case A: User not found
    // (deleted by TTL OR never existed)
    if (!user) {
      return res.status(400).json({
        message:
          "Verification expired or account not found. Please sign up again.",
      });
    }

    // 🔴 Case B: OTP expired
    if (!user.verificationExpires || user.verificationExpires < Date.now()) {
      // optional: cleanup immediately (TTL will also handle)
      await userModal.deleteOne({ _id: user._id });

      return res.status(400).json({
        message: "Verification code expired. Please sign up again.",
      });
    }

    // 🔴 Case C: OTP does not match
    if (user.verificationCode !== hashedCode) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    // ✅ Case D: OTP valid → activate user
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Verification failed",
    });
  }
};

export const resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModal.findOne({
      email: email.toLowerCase(),
      isVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "Account not found or already verified",
      });
    }

    // Generate new OTP
    const otp = generateVerificationCode();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.verificationCode = hashedOtp;
    user.verificationExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendVerificationEmail({
      to: user.email,
      name: user.fullname,
      code: otp,
    });

    return res.status(200).json({
      message: "Verification code resent",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      message: "Failed to resend code",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Username and password are required",
      });
    }

    // 1️⃣ Find user
    const user = await userModal
      .findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      })
      .select("+password");

    // 🔴 User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🔴 Google-only account
    if (user.provider === "google" && !user.password) {
      return res.status(403).json({
        message:
          "This account was created using Google. Please log in with Google or set a password using 'Forgot Password'.",
      });
    }

    // 🔴 User exists but not verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    // 2️⃣ Compare password (FIXED)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    let avatarUrl = null;
    if (user.profilePicture) {
      avatarUrl = `${process.env.BASE_URL}/users/upload/profile/${user.profilePicture}`;
    }

    // 4️⃣ Respond
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profilePicture: avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export const fetchMe = async (req, res) => {
  try {
    // req.user is set by protect middleware (from JWT)
    const user = await userModal
      .findById(req.user.id)
      .select("username email fullName profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let avatarUrl = null;
    if (user.profilePicture) {
      avatarUrl = `${process.env.BASE_URL}/users/upload/profile/${user.profilePicture}`;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      profilePicture: avatarUrl,
    });
  } catch (error) {
    console.error("fetchMe error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.redirect(`http://localhost:5173/googleauthsuccess?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect("http://localhost:5173/login");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModal.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json({
        message: "User Not Found",
      });
    }

    const otp = generateVerificationCode();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordCode = hashedOtp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendPasswordResetEmail({
      to: user.email,
      name: user.fullname,
      code: otp,
    });

    return res.status(200).json({
      message: "Password Code Sent",
    });
  } catch (error) {
    console.error("Reset Password error:", error);
    return res.status(500).json({
      message: "Password Reset failed",
    });
  }
};

export const verifyPasswordReset = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    // 1️⃣ Hash the OTP entered by user
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    // 2️⃣ Find user (unverified)
    const user = await userModal
      .findOne({
        email: email.toLowerCase(),
      })
      .select("+resetPasswordCode +resetPasswordExpire");

    // 🔴 Case A: User not found
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // 🔴 Case B: OTP expired
    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        message: "Verification expired. Please Try again.",
      });
    }

    // 🔴 Case C: OTP does not match
    if (user.resetPasswordCode !== hashedCode) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    // ✅ Case D: OTP valid → activate user
    user.resetPasswordVerified = true;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password Reset Successfully",
      passwordReset: true,
    });
  } catch (error) {
    console.error("Reset Password Varification Error:", error);
    return res.status(500).json({
      message: "Password Reset Varification failed",
    });
  }
};

export const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // 2️⃣ Find user
    const user = await userModal
      .findOne({ email: email.toLowerCase() })
      .select("+resetPasswordVerified");

    if (!user || !user.resetPasswordVerified) {
      return res.status(403).json({
        message: "Password reset not authorized",
      });
    }
    // 3️⃣ Set new password
    user.password = password;
    // ✅ Important: allow email+password login for Google users
    user.provider = "local";
    // 4️⃣ Cleanup reset fields (safe even if undefined)
    user.resetPasswordVerified = false;

    await user.save(); // bcrypt runs via pre-save hook
    return res.status(200).json({
      message: "Password updated successfully",
      newPassword: true,
    });
  } catch (error) {
    console.error("Setting New Password Fail:", error);
    return res.status(500).json({
      message: "Setting new password failed",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // 2️⃣ Find user
    const user = await userModal.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.password || user.provider === "google") {
      return res.status(400).json({
        message:
          "This account does not have a password yet. Please use 'Forgot Password' to set one.",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({
        message: "New password cannot be same as current password",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current Password Not Matched",
      });
    }
    user.password = newPassword;
    await user.save(); // bcrypt runs via pre-save hook
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Updating Password Faild:", error);
    return res.status(500).json({
      message: "Updating password failed",
      error: error,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, fullname } = req.body;

    const updates = {};

    if (username) updates.username = username.toLowerCase();
    if (email) updates.email = email.toLowerCase();
    if (fullname) updates.fullname = fullname;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const user = await userModal.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let avatarUrl = null;
    if (user.profilePicture) {
      avatarUrl = `${process.env.BASE_URL}/users/upload/profile/${user.profilePicture}`;
    }

    return res.status(200).json({
      message: "Details updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profilePicture: avatarUrl,
      },
    });
  } catch (error) {
    console.error("Updating User Details Failed:", error);
    return res.status(500).json({
      message: "Updating User Details Failed",
      error: error,
    });
  }
};
