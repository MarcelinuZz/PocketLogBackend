import { Router } from "express";
import { sendOTP } from "../controllers/emailControllers.mjs";

const router = Router()

router.post('/send-otp', sendOTP);

export default router;