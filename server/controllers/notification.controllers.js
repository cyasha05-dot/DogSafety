import nodemailer from "nodemailer";
import { Notification } from "../models/Notification.models.js";
import dotenv from "dotenv";

dotenv.config();

export const sendNotification = async (report) => {
  try {
    const recipients = process.env.NOTIFICATION_RECIPIENT.split(",");

    // Create notification in DB
    await Notification.create({
      reportId: report._id,
      message: `Urgent: A ${report.category} dog reported at lat ${report.location.lat}, lng ${report.location.lng}.`,
      recipient: recipients.join(", "),
    });

    // Send email via SendGrid
    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey", // literally "apikey"
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: '"Dog Safety App" <noreply@dogsafety.com>',
      to: recipients,
      subject: "Urgent Dog Safety Alert",
      text: `A ${report.category} dog has been reported!\n\nDescription: ${report.description}\nLocation: Lat ${report.location.lat}, Lng ${report.location.lng}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Notification sent successfully via SendGrid.");
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
