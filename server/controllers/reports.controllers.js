import Report from "../models/Reports.models.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Optional: setup email transporter (SendGrid)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create new report
export const createReport = async (req, res) => {
  try {
    const { location, description, severity, dogCount, contactNumber } =
      req.body;

    // Photos uploaded via Cloudinary
    const photos = req.files?.map((file) => file.path) || [];

    const newReport = await Report.create({
      location,
      description,
      severity,
      dogCount,
      contactNumber,
      photos,
      timestamp: new Date(),
    });

    // Notify authorities if severity is high
    if (severity === "high") {
      const recipients = process.env.NOTIFY_EMAILS.split(",");
      await transporter.sendMail({
        from: `"Street Dog Alert" <${process.env.EMAIL_USER}>`,
        to: recipients,
        subject: "High Severity Dog Incident Reported",
        html: `
          <h3>High Severity Dog Incident</h3>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Contact:</strong> ${contactNumber}</p>
        `,
      });
    }

    res.status(201).json({ message: "Report submitted", report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update report status
export const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
