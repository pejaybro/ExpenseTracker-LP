import { generateTripPlaceholderSummary } from "../ai-services/open-ai/trip-summary.js";
import { tripModal } from "../models/trip-modal.js";
import { generateDataHash } from "../utils/hashUtils.js";

const insertTrip = async (req, res) => {
  try {
    const data = req.body;

    // Create a new Trip entry using your trip model
    const newTrip = new tripModal(data);
    //await newTrip.save();
    const placeholderText = await generateTripPlaceholderSummary(newTrip);

    console.log("Placeholder Generated text", placeholderText);

    const initialData = {
      tripDetails: newTrip.toObject(),
      expenses: [], // Important: Use an empty array since no expenses exist yet
    };
    const initialHash = generateDataHash(initialData);
    newTrip.tripSummary = placeholderText ?? "Not Generated";
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

export { insertTrip, fetchTrip };
