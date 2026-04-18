import express from "express";
import {
  addVolunteer,
  getVolunteers,
  deleteVolunteer,
  updateVolunteer,
  getPublicVolunteersByUnit,
} from "../controllers/volunteer.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const router = express.Router();

// ADD
router.post("/volunteers/add", authMiddleware, uploadImage.single("photo"), addVolunteer);

// GET
router.get("/volunteers", authMiddleware, getVolunteers);

// DELETE ✅
router.delete("/volunteers/:id", authMiddleware, deleteVolunteer);

// UPDATE ✅
router.put("/volunteers/:id", authMiddleware, uploadImage.single("photo"), updateVolunteer);

router.get("/public/volunteers/unit/:unit_code", getPublicVolunteersByUnit);

export default router;