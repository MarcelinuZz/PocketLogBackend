import { Router } from "express";
import { body, validationResult } from 'express-validator';
import passport from "passport";
import * as authController from "../controllers/authController.mjs";

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

router.post("/login-local", [
    body("username").notEmpty().withMessage("Username wajib diisi."),
    body("password").notEmpty().withMessage("Password wajib diisi."),
    validateRequest
], authController.loginLocal);

router.post("/verify-email", [
    body("email").isEmail().withMessage("Format email salah."),
    validateRequest
], authController.VerifyEmailReq);

router.post("/register-local", [
    body("name").notEmpty().withMessage("Nama wajib diisi."),
    body("email").isEmail().withMessage("Format email salah."),
    body("gender").notEmpty().withMessage("Gender wajib diisi."),
    body("dob").isDate().withMessage("Format tanggal salah."),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter."),
    body("challengeToken").notEmpty().withMessage("chalangeToken wajib diberikan."),
    body("otpCode").notEmpty().withMessage("otpCode wajib diberikan."),
    validateRequest
], authController.registerLocal);

router.post("/refresh-token", authController.refreshToken);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleCallback);

router.post("/exchange-token", [
    body("authCode").notEmpty().withMessage("authCode wajib diberikan."), validateRequest
], authController.exchangeToken);

router.post("/logout", authController.logout);

export default router;