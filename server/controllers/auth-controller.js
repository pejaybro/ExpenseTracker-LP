import { userModal } from "../models/user-modal.js";
import { sendVerificationEmail } from "../services/email/send-user-otp.js";
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
    // identifier = email OR username

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Username and password are required",
      });
    }

    // 1️⃣ Find user by email OR username
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

    // 🔴 User exists but not verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(
      "Compare result:",
      await bcrypt.compare(password, user.password)
    );
    console.log("Password length:", password.length);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 4️⃣ Respond (never send password)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profilePicture: user.profilePicture,
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

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      profilePicture: user.profilePicture || null,
    });
  } catch (error) {
    console.error("fetchMe error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
