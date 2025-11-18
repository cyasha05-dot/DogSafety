import Report from "../models/Reports.models.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sendEmail from "../utils/testmail.js";

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
    const {
      name,
      email,
      location,
      description,
      severity,
      dogCount,
      contactNumber,
    } = req.body;

    // Format date as dd/mm/yyyy
    const formatDate = () => {
      const d = new Date();
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Photos from Cloudinary
    const photos = req.files?.map((file) => file.path) || [];

    const newReport = await Report.create({
      name,
      email,
      location,
      description,
      severity, // Aggressive / Struck / Injured
      dogCount: Number(dogCount),
      contactNumber,
      photos,
      timestamp: formatDate(), // formatted
    });

    // Email to admin
    const adminEmail = "cyasha05@gmail.com";
    const subject = "New Dog Incident Report Submitted";

    const html = `
      <h2>New Report Submitted</h2>
      <p><strong>Location:</strong> ${newReport.location}</p>
      <p><strong>Description:</strong> ${newReport.description}</p>
      <p><strong>Severity:</strong> ${newReport.severity}</p>
      <p><strong>Dog Count:</strong> ${newReport.dogCount}</p>
      <p><strong>Date:</strong> ${newReport.timestamp}</p>
      <p><strong>Reported By:</strong> ${newReport.name}</p>
    `;

    await sendEmail(adminEmail, subject, html);

    // Confirmation email to the user
    if (newReport.email) {
      const userSubject = "Thank you for reporting!";
      const userHtml = `
        <h2>Report Received</h2>
        <p>Thank you, ${newReport.name}, for reporting the incident.</p>
        <p>We will take necessary action soon.</p>
        <p><strong>Report ID:</strong> ${newReport._id}</p>
        <p><strong>Date:</strong> ${newReport.timestamp}</p>
      `;
      await sendEmail(newReport.email, userSubject, userHtml);
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
  // console.log("status", status);

  try {
    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(201).json({ report, message: "Report not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
