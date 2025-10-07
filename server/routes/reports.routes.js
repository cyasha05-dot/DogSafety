import express from "express";
import {
  getReports,
  updateReportStatus,
  createReport,
  getReportById,
} from "../controllers/reports.controllers.js";
import parser from "../middlewares/upload.middlewares.js";

const router = express.Router();

// GET all reports
router.get("/", getReports);

// POST new report with photos
router.post("/", parser.array("photos", 5), createReport);

//getreportbyid
router.get("/:id", getReportById);

// PUT update report status
router.put("/:id/status", updateReportStatus);

export default router;
