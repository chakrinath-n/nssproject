import { Router } from "express";
import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller";

import { loginAdmin } from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/* ================= LOGIN ROUTE (PUBLIC) ================= */

router.post("/login", loginAdmin);

/* ================= ADMIN CRUD ROUTES (PROTECTED) ================= */

router.get("/", authMiddleware, getAdmins);

router.get("/:id", authMiddleware, getAdminById);

router.post("/", authMiddleware, createAdmin);

router.put("/:id", authMiddleware, updateAdmin);

router.delete("/:id", authMiddleware, deleteAdmin);

export default router;
