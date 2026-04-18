import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
} from "../controllers/image.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Public routes
router.get("/", getImages);
router.get("/:id", getImageById);

// Protected routes
router.post("/", authMiddleware, upload.single("image"), createImage);
router.put("/:id", authMiddleware, updateImage);
router.delete("/:id", authMiddleware, deleteImage);

export default router;