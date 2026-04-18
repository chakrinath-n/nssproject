import express from "express";
import {
  officerLogin,
  officerDashboard,
  createActivity,
  changePassword,
  getEbsbVolunteers,
  getPublicDashboard, // ✅ ADD
} from "../controllers/officer.controller";
import { officerAuth } from "../middleware/officerAuth.middleware";

const router = express.Router();

/* Officer Login */
router.post("/login", officerLogin);

/* Public Dashboard */ 
router.get("/public-dashboard", getPublicDashboard); // ✅ ADD - no auth

/* Dashboard */
router.get("/dashboard", officerAuth, officerDashboard);

/* Submit Activity */
router.post("/activity", officerAuth, createActivity);

/* Change Password */
router.put("/change-password", officerAuth, changePassword);

/* EBSB Volunteers */
router.get("/ebsb-volunteers", officerAuth, getEbsbVolunteers);

export default router;