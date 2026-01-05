import express from "express";
import { fetchTotal } from "../controllers/total-controller.js";
import { protect } from "../middlewares/auth.js";

const totalRouter = express.Router();

totalRouter.get("/get-total",protect, fetchTotal);

export { totalRouter };
