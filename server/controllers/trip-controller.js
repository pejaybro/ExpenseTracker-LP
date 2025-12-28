import {
  generateTripPlaceholderSummary,
  generateTripSummary,
} from "../ai-services/genai/trip-summary.js";
import { tripModal } from "../models/trip-modal.js";
import { generateDataHash } from "../utils/hashUtils.js";
import mongoose from "mongoose";
import { deleteTripExpenses } from "./transaction-controller.js";

const insertTrip = async (req, res) => {
  try {
    const data = req.body;

    // Create a new Trip entry using your trip model
    const newTrip = new tripModal(data);
    //await newTrip.save();
    const placeholderText = await generateTripPlaceholderSummary(newTrip);
    const initialHash = generateDataHash({
      tripTitle: newTrip.tripTitle,
      startOn: newTrip.startOn,
      endsOn: newTrip.endsOn,
      tripType: newTrip.tripType,
      travelType: newTrip.travelType,
      ofGroup: newTrip.ofGroup,
      abroadInfo: newTrip.abroadInfo,
      tripTotal: newTrip.tripTotal,
    });

    newTrip.tripSummary = placeholderText;
    newTrip.tripHashData = initialHash;
    await newTrip.save();

    // Send success response
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Insert Trip Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Trip" });
  }
};

const fetchTrip = async (req, res) => {
  try {
    let { userID } = req.params;
    userID = parseInt(userID, 10);
    if (isNaN(userID)) {
      return res
        .status(400)
        .json({ message: "Invalid userID format. Must be a number." });
    }

    // Fetch trips for the given user, sorted by trip created date (latest first)
    const data = await tripModal.find({ userID }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch Trip Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch Trip data" });
  }
};

export const fetchTripDeatils = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid Trip ID" });
    }
    const trip = await tripModal.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.tripTotal > 0) {
      const newHash = generateDataHash({
        tripTitle: trip.tripTitle,
        startOn: trip.startOn,
        endsOn: trip.endsOn,
        tripType: trip.tripType,
        travelType: trip.travelType,
        ofGroup: trip.ofGroup,
        abroadInfo: trip.abroadInfo ?? null,
        tripTotal: trip.tripTotal,
      });
      if (newHash !== trip.tripHashData) {
        const newSummary = await generateTripSummary(trip);
        trip.tripSummary = newSummary;
        trip.tripHashData = newHash;
        await trip.save();
      }
    }

    // check hash

    return res.status(200).json(trip);
  } catch (error) {
    console.error("Fetch Trip Deatils Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch Trip Details data" });
  }
};

const updateTripTotal = async (type, entry, session) => {
  try {
    const { userID, ofAmount, ofTrip } = entry;
    const tripData = await tripModal
      .findOne({ userID, _id: ofTrip })
      .session(session);
    if (!tripData) {
      throw new Error("Trip not found");
    }
    if (type === 1) {
      tripData.tripTotal = tripData.tripTotal + ofAmount;
    } else if (type === 0) {
      // This ensures it never goes below 0
      tripData.tripTotal = Math.max(0, tripData.tripTotal - ofAmount);
    }
    await tripData.save({ session });
    console.log("Trip Total updated correctly.");
  } catch (error) {
    console.error("Error occurred while updating Trip Total:", error);
    throw new Error("Failed to update trip total breakdown.");
  }
};

export const deleteTrip = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { userID, tripId } = req.params;
    if (!userID || !tripId) {
      return res
        .status(400)
        .json({ message: "userID and tripId are required" });
    }
    const trip = await tripModal.findOneAndDelete(
      {
        userID,
        _id: tripId,
      },
      { session }
    );
    if (!trip) {
      await session.abortTransaction();
      return res.status(400).json({ message: "No Trip Found to delete." });
    }
    const count = await deleteTripExpenses(tripId, userID, session);
    await session.commitTransaction();
    res.status(200).json({
      count: count,
      trip: trip,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Trip aborted:", error);
    return res.status(500).json({
      message: error.message || "Failed to Delete Trip",
    });
  } finally {
    session.endSession();
  }
};

export const updateTrip = async (req, res) => {
  try {
    const data = req.body;

    const existingTrip = await tripModal.findOne({
      userID: data.userID,
      _id: data._id,
    });
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found to update." });
    }

    if (
      existingTrip.tripTotal <= 0 &&
      typeof data.tripTitle === "string" &&
      data.tripTitle.trim() !== existingTrip.tripTitle.trim()
    ) {
      const placeholderText = await generateTripPlaceholderSummary(data);
      data.tripSummary = placeholderText;
    }

    const updatedTrip = await tripModal.findOneAndUpdate(
      {
        userID: data.userID,
        _id: data._id,
      },
      { $set: data },
      { new: true, runValidators: true, timestamps: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found to update." });
    }

    console.log("trip details", updateTrip);

    res.status(201).json(updatedTrip);
  } catch (error) {
    console.error("Update Trip Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to Update Trip" });
  }
};

export { insertTrip, fetchTrip, updateTripTotal };
