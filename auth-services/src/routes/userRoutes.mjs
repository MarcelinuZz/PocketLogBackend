import { Router } from "express";
import { body, validationResult } from 'express-validator';
import * as userProfileController from "../controllers/userProfileController.mjs";
import * as accountController from "../controllers/accountController.mjs";
import { handleAvatarUpload } from "../middleware/uploadMiddleware.mjs";

const router = Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validasi Gagal", error: errors.array() });
    }
    next();
};


router.get('/me', userProfileController.getMe);

router.patch('/change-name', [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong."), validateRequest
], userProfileController.changeName);

router.patch('/change-gender', [
    body("gender").notEmpty().withMessage("Gender tidak boleh kosong."), validateRequest
], userProfileController.changeGender);

router.patch('/change-dob', [
    body("dob").notEmpty().withMessage("Tanggal lahir tidak boleh kosong."), validateRequest
], userProfileController.changeDOB);

router.patch('/change-avatar-url',
    handleAvatarUpload,
    userProfileController.changeAvatarUrl
);

router.post('/bind-google', [
    body("googleIdToken").notEmpty().withMessage("Google ID Token wajib diisi."), validateRequest
], userProfileController.bindGoogle);

router.post('/unbind-google', userProfileController.unbindGoogle);

router.get('/check-auth', userProfileController.CheckAuth);


router.post('/change-password/request-otp', [
    body("oldPassword").notEmpty().withMessage("Password lama wajib diisi."), validateRequest
], accountController.requestChangePasswordOTP);

router.post('/change-password/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("newPassword").isLength({ min: 6 }).withMessage("Password baru minimal 6 karakter."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], accountController.confirmChangePassword);

router.post('/change-email/request-otp', [
    body("newEmail").isEmail().withMessage("Format email tidak valid."), validateRequest
], accountController.requestChangeEmailOTP);

router.post('/change-email/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], accountController.confirmChangeEmail);

router.post('/delete-account/request-otp', [
    body("password").notEmpty().withMessage("Password wajib diisi untuk konfirmasi."), validateRequest
], accountController.requestDeleteAccountOTP);

router.post('/delete-account/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], accountController.confirmDeleteAccount);

export default router;
