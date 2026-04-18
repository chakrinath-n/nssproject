import { Router } from "express";

import {
  getNssUnits,
  getNssUnitById,
  createNssUnit,
  updateNssUnit,
  deleteNssUnit,
} from "../controllers/nssUnit.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/* ================= PUBLIC ROUTES ================= */

// Get all NSS Units
router.get("/", getNssUnits);

// Get NSS Unit by ID
router.get("/:id", getNssUnitById);

/* ================= PROTECTED ROUTES ================= */

// Create NSS Unit
router.post("/", authMiddleware, createNssUnit);

// Update NSS Unit
router.put("/:id", authMiddleware, updateNssUnit);

// Delete NSS Unit
router.delete("/:id", authMiddleware, deleteNssUnit);

export default router;
