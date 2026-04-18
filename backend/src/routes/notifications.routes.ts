import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  getPublicNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadNotification } from "../middleware/uploadnotification.middleware";


const router = Router();

/* =========================
   PUBLIC ROUTES
========================= */

// This must be above /:id
router.get("/public", getPublicNotifications);

// If you still want general list (admin view)
router.get("/", getNotifications);

// Single notification by ID (must come AFTER /public)
router.get("/:id", getNotificationById);


/* =========================
   PROTECTED ROUTES
========================= */

router.post("/", uploadNotification.single("file"), createNotification);
router.put("/:id", uploadNotification.single("file"), updateNotification);
router.delete("/:id", authMiddleware, deleteNotification);

export default router;