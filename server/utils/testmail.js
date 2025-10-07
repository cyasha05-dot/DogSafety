import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey", // literally "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Dog Safety App" <noreply@dogsafety.com>',
      to: process.env.NOTIFICATION_RECIPIENT,
      subject: "Test Email from Dog Safety App",
      text: "This is a test email using SendGrid!",
    });
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

sendTestEmail();
