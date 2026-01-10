/* eslint-disable no-undef */
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

//--- Database ---
import { connectToDatabase } from "./database/connection.js";
import mongoose from "mongoose";

//--- Routers ---
import { budgetRouter } from "./routes/budgetRoute.js";
import { totalRouter } from "./routes/totalRoute.js";
import { minmaxRouter } from "./routes/minmaxRoute.js";
import { transactionRouter } from "./routes/transactionRoute.js";
import { tripRouter } from "./routes/tripRoute.js";
import { userRouter } from "./routes/userRoute.js";
import { goalRouter } from "./routes/savingGoalRoute.js";
import path from "path";

//--- Crons ---
import "./crons/reset-recurring-payment-status.js";

// --- Passport
import passport from "passport";
import "./services/passport/passport-config.js";

export const PORT = 8080;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use("/transaction", transactionRouter);
app.use("/budget", budgetRouter);
app.use("/total", totalRouter);
app.use("/minmax", minmaxRouter);
app.use("/trip", tripRouter);
app.use("/user", userRouter);
app.use("/saving-goal", goalRouter);

export const USERS_DIR = path.join(process.cwd(), "users");
export const PROFILE_UPLOAD_DIR = path.join(USERS_DIR, "upload", "profile");
if (!fs.existsSync(PROFILE_UPLOAD_DIR)) {
  fs.mkdirSync(PROFILE_UPLOAD_DIR, { recursive: true });
}
app.use(
  "/users/upload/profile",
  express.static(PROFILE_UPLOAD_DIR)
);

// --- Start Server ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// --- Graceful Shutdown Logic ---
const gracefulShutdown = signal => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed. Exiting.");
      process.exit(0);
    });
  });
};

// --- Monitor DB Connection Events ---
mongoose.connection.on("connected", () => {
  console.log("✅ Database connection successful.");
});

mongoose.connection.on("error", err => {
  console.error("❌ Database connection error:", err);
  // If a connection error occurs, shut down the server.
  gracefulShutdown("DB_ERROR");
});

// --- Initiate Connection ---
// We call this to start the connection process. The listeners above will handle the outcome.
connectToDatabase().catch(() => {});

// --- Listen for OS Signals to shut down gracefully ---
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
