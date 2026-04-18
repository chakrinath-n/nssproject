import express from "express";
import {
  addSpecialCamp,
  getSpecialCamps,
  deleteSpecialCamp,
} from "../controllers/specialCamp.controller";
import { officerAuth } from "../middleware/officerAuth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const router = express.Router();

const uploadCampFiles = uploadImage.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
  { name: "news_clipping1", maxCount: 1 },
  { name: "news_clipping2", maxCount: 1 },
]);

router.post("/add", officerAuth, uploadCampFiles, addSpecialCamp);
router.get("/", officerAuth, getSpecialCamps);
router.delete("/:id", officerAuth, deleteSpecialCamp);

export default router;