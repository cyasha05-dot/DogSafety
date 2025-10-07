import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    message: { type: String, required: true },
    recipient: { type: String, required: true }, // e.g., municipality or NGO
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
