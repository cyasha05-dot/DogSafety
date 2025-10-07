import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/DB.config.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import cors from "cors";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
