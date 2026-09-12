import express from "express";
import { registerUser, loginUser, googleAuth, logoutUser, getMe } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;
