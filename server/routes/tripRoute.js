import express from "express";
import {
  deleteTrip,
  fetchTrip,
  fetchTripDeatils,
  insertTrip,
  updateTrip,
} from "../controllers/trip-controller.js";
import { tripValidation } from "../middlewares/trip-validation.js";

const tripRouter = express.Router();

tripRouter.get("/get-trip/:userID", fetchTrip);
tripRouter.get("/get-trip-details/:tripId", fetchTripDeatils);

tripRouter.post(
  "/add-trip",
  tripValidation, // ✅ validate incoming trip data
  insertTrip // ✅ insert trip into DB
);

tripRouter.delete("/delete-trip/:userID/:tripId", deleteTrip);

tripRouter.post("/update-trip-details", tripValidation, updateTrip);

export { tripRouter };
