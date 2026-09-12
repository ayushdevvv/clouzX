import express from "express";
import { getPublicSharedFile } from "../controllers/fileController.js";

const router = express.Router();

router.get("/share/:token", getPublicSharedFile);

export default router;
