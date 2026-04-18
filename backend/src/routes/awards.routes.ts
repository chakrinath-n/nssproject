import express from "express";
import {
  getAwards,
  addAward,
  updateAward,
  deleteAward,
} from "../controllers/awards.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getAwards);                                              // public
router.post("/", authMiddleware, uploadImage.single("photo"), addAward);
router.put("/:id", authMiddleware, uploadImage.single("photo"), updateAward);
router.delete("/:id", authMiddleware, deleteAward);

export default router;