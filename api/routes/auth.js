import express from "express";
import { verifyOTP } from "../controllers/auth.js";
import { sendOTP } from "../controllers/auth.js";
import { sendEmailOTP } from "../controllers/auth.js";
import { verifyEmailOTP } from "../controllers/auth.js";

const router = express.Router();

router.post("/sendOTP",sendOTP);
router.post("/verifyOTP",verifyOTP)
router.post("/sendEmailOTP",sendEmailOTP);
router.post("/verifyEmailOTP",verifyEmailOTP);

export default router;