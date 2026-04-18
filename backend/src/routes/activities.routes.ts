import { Router } from "express";
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware"; // ← new

const router = Router();

/* ================= PUBLIC ROUTES ================= */

// Get activities - ?source=admin filters only admin activities
router.get("/", getActivities);

// Get single activity by ID
router.get("/:id", getActivityById);

/* ================= PROTECTED (Admin only) ================= */

router.post("/", authMiddleware, requireRole("admin"), createActivity);
router.put("/:id", authMiddleware, requireRole("admin"), updateActivity);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteActivity);

export default router;