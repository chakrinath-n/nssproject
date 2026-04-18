import { Router } from "express";
import {
  getReports,
  createReport,
  deleteReport,
} from "../controllers/report.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { uploadDocument } from "../middleware/upload.middleware";

const router = Router();

// Public
router.get("/", getReports);

// Admin
router.post(
  "/",
  authMiddleware,
  uploadDocument.single("file"),
  createReport
);

router.delete("/:id", authMiddleware, deleteReport);

export default router;