import express from "express";
import {
  deleteTrip,
  fetchTrip,
  fetchTripDeatils,
  insertTrip,
  updateTrip,
} from "../controllers/trip-controller.js";
import { tripValidation } from "../middlewares/trip-validation.js";
import { protect } from "../middlewares/auth.js";

const tripRouter = express.Router();

tripRouter.get("/get-trip", protect, fetchTrip);
tripRouter.get("/get-trip-details/:tripId", protect, fetchTripDeatils);

tripRouter.post(
  "/add-trip",
  protect,
  tripValidation, // ✅ validate incoming trip data
  insertTrip // ✅ insert trip into DB
);

tripRouter.delete("/delete-trip/:tripId", protect, deleteTrip);

tripRouter.post("/update-trip-details", protect, tripValidation, updateTrip);

export { tripRouter };
