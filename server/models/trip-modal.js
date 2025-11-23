/* REVIEW - modal is the database design to store value
 ** NOTE - it will be used inside controller when injecting the data in DB
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    userID: {
      type: Number,
      required: true,
      index: true,
      unique: false,
    },
    tripType: {
      type: Number, // 0 = Domestic, 1 = International
      enum: {
        values: [0, 1],
        message: "tripType must be either 0 or 1 ",
      },
      required: true,
      index: true,
    },
    abroadInfo: {
      type: {
        country: { type: String },
        currency: { type: String },
        currencyCode: { type: String },
        rate: { type: Number },
      },
      default: null,
    },
    travelType: {
      type: Number, // 0 = Solo, 1 = Solo Family, 2 = Group, 3 = Group of Families
      enum: {
        values: [0, 1, 2, 3],
        message: "travelType must be either 0,1, 2 or 3",
      },
      required: true,
      index: true,
    },
    startOn: {
      type: Date,
      required: true,
    },
    endsOn: {
      type: Date,
      required: true,
    },
    tripTitle: {
      type: String,
      required: true,
      trim: true,
    },
    ofGroup: {
      type: Number,
      required: true,
      min: [1, "Group/Members size must be atleast 1"],
      default: 1,
    },
    tripTotal: {
      type: Number,
      default: 0,
      index: true,
      min: [0, "Trip total cannot be negative"],
    },
    tripHashData: {
      type: String,
      required: false,
      default: null,
    },
    tripSummary: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    collection: "default-trip", // <-- this line overrides pluralization of adding "s" at last of collection name
    timestamps: true,
  }
);

const tripModal = mongoose.model("Trip", tripSchema);
export { tripModal };
