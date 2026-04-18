import express from "express";
import multer from "multer";
import path from "path";

import {
  getAbout,
  updateAbout,
  addTeamMember,
  deleteTeamMember,
} from "../controllers/about.controller";

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: "uploads/about",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

router.get("/", getAbout);
router.put("/", updateAbout);

router.post("/team", upload.single("image"), addTeamMember);
router.delete("/team/:id", deleteTeamMember);

export default router;