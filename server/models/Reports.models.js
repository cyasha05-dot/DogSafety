import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  severity: {
    type: String,
    enum: ["Aggressive", "Struck", "Injured"],
    required: true,
  },

  dogCount: {
    type: Number,
    required: true,
  },

  contactNumber: {
    type: String,
    required: true,
  },

  photos: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "pending",
  },

  timestamp: {
    type: String, // formatted date
    required: true,
  },
});

export default mongoose.model("Report", ReportSchema);
