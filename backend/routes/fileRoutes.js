import express from "express";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getFiles,
  getTimeline,
  getTrashedFiles,
  getDuplicates,
  getLargeFiles,
  toggleStar,
  trashFile,
  restoreFile,
  deleteFilePermanently,
  getStorageStats,
  createShare,
  revokeShare,
  getSharedFiles,
} from "../controllers/fileController.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.get("/timeline", getTimeline);
router.get("/trash", getTrashedFiles);
router.get("/duplicates", getDuplicates);
router.get("/large", getLargeFiles);
router.get("/shared", getSharedFiles);
router.get("/stats", getStorageStats);
router.patch("/:id/star", toggleStar);
router.patch("/:id/trash", trashFile);
router.patch("/:id/restore", restoreFile);
router.post("/:id/share", createShare);
router.delete("/:id/share", revokeShare);
router.delete("/:id", deleteFilePermanently);

export default router;
