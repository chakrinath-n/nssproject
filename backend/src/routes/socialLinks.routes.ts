import express from "express";
import {
  getSocialLinks,
  updateSocialLinks,
} from "../controllers/socialLinks.controller";
import { officerAuth } from "../middleware/officerAuth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", officerAuth, getSocialLinks);

// ✅ single image upload
router.put("/", officerAuth, uploadImage.single("profile_image"), updateSocialLinks);

export default router;