// utils/mailer.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body || error.message
    );
  }
};

export default sendEmail;
