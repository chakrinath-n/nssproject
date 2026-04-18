import express from "express";
import {
  addActivity,
  getActivitiesByType,
  getAllActivities,
  deleteOfficerActivity,
  updateOfficerActivity,
  getPublicActivitiesByUnit,  // ✅ ADD
  getPublicActivityDetail,    // ✅ ADD
} from "../controllers/officerActivity.controller";
import { officerAuth } from "../middleware/officerAuth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const router = express.Router();

const uploadActivityPhotos = uploadImage.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
]);

// Officer routes (protected)
router.post("/activities/add", officerAuth, uploadActivityPhotos, addActivity);
router.get("/activities", officerAuth, getAllActivities);
router.get("/activities/type/:type_id", officerAuth, getActivitiesByType);
router.delete("/activities/:id", officerAuth, deleteOfficerActivity);
router.put("/activities/:id", officerAuth, uploadActivityPhotos, updateOfficerActivity);

// ✅ Public routes (no auth)
router.get("/public/activities/unit/:unit_code", getPublicActivitiesByUnit);
router.get("/public/activities/detail/:id", getPublicActivityDetail);

export default router;