import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// ✅ Protected route only
router.get("/stats", authMiddleware, getDashboardStats);

export default router;