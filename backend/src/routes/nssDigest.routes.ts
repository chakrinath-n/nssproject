import express from "express";
import { getNssDigest } from "../controllers/nssDigest.controller";

const router = express.Router();

router.get("/", getNssDigest);

export default router;