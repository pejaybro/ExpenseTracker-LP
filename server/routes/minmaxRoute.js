import express from "express";
import { fetchMM } from "../controllers/minmax-controller.js";

const minmaxRouter = express.Router();

minmaxRouter.get("/get-data", fetchMM);

export { minmaxRouter };
