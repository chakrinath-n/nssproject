import express from "express";
import {
  getActivityTypes,
  addActivityType,
  updateActivityType,
  deleteActivityType,
} from "../controllers/activityType.controller";
import { officerAuth } from "../middleware/officerAuth.middleware";

const router = express.Router();

/* GET ALL */
router.get("/", getActivityTypes);

/* ADD */
router.post("/", officerAuth, addActivityType);

/* UPDATE */
router.put("/:id", officerAuth, updateActivityType);

/* DELETE */
router.delete("/:id", officerAuth, deleteActivityType);

export default router;