import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  location: { type: String, required: true },
  severity: { type: String, enum: ["low", "medium", "high"], required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "dismissed"],
    default: "pending",
  },
  photos: [{ type: String }],
  dogCount: { type: String, required: true },
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reportedBy: { type: String },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
