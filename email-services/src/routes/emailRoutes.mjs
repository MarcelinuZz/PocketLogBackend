import { Router } from "express";
import { body, validationResult } from 'express-validator';
import { sendOTP } from "../controllers/emailControllers.mjs";

const router = Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validasi Gagal",
            error: errors.array()
        });
    }
    next();
};

router.post('/send-otp', [
    body("to").isEmail().withMessage("Format email tujuan tidak valid."),
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("actionType").notEmpty().withMessage("Tipe aksi wajib diisi."),
    validateRequest
], sendOTP);

export default router;