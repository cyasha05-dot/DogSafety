import express from "express";
import {
  getNearbyDoctors,
  getDoctorDetails,
} from "../controllers/doctor.controllers.js";

const router = express.Router();

// Get nearby vets
router.get("/nearby", getNearbyDoctors);

// Get detailed info for ONE vet
router.get("/details/:placeId", getDoctorDetails);

export default router;
