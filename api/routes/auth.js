import express from "express";
import { verifyOTP } from "../controllers/auth.js";
import { sendOTP } from "../controllers/auth.js";

const router = express.Router();

router.post("/sendOTP",sendOTP);
router.post("/verifyOTP",verifyOTP)


export default router;