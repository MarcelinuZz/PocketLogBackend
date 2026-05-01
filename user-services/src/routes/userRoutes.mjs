import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getMe, changeName, changeGender, changeDOB, changeAvatarUrl, bindGoogle, unbindGoogle, CheckAuth, changeSettings } from '../controllers/userController.mjs';
import {
    requestChangePasswordOTP, confirmChangePassword,
    requestChangeEmailOTP, confirmChangeEmail,
    requestDeleteAccountOTP, confirmDeleteAccount
} from '../controllers/otpController.mjs';

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

router.get('/me', getMe);

router.patch('/change-name', [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong."),
    validateRequest
], changeName);

router.patch('/change-gender', [
    body("gender").notEmpty().withMessage("Gender tidak boleh kosong."),
    validateRequest
], changeGender);

router.patch('/change-dob', [
    body("dob").notEmpty().withMessage("Tanggal lahir tidak boleh kosong."),
    validateRequest
], changeDOB);

router.patch('/change-avatar-url', [
    body("avatar_url").notEmpty().withMessage("URL avatar tidak boleh kosong."),
    validateRequest
], changeAvatarUrl);

router.post('/change-password/request-otp', [
    body("oldPassword").notEmpty().withMessage("Password lama wajib diisi."),
    validateRequest
], requestChangePasswordOTP);

router.post('/change-password/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("newPassword").isLength({ min: 6 }).withMessage("Password baru minimal 6 karakter."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], confirmChangePassword);

router.post('/change-email/request-otp', [
    body("newEmail").isEmail().withMessage("Format email tidak valid."),
    validateRequest
], requestChangeEmailOTP);

router.post('/change-email/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], confirmChangeEmail);

router.post('/delete-account/request-otp', [
    body("password").notEmpty().withMessage("Password wajib diisi untuk konfirmasi."),
    validateRequest
], requestDeleteAccountOTP);

router.post('/delete-account/confirm', [
    body("otpCode").notEmpty().withMessage("Kode OTP wajib diisi."),
    body("challengeToken").notEmpty().withMessage("Challenge token wajib diisi."),
    validateRequest
], confirmDeleteAccount);

router.post('/bind-google', [
    body("googleIdToken").notEmpty().withMessage("Google ID Token wajib diisi."),
    validateRequest
], bindGoogle);

router.post('/unbind-google', unbindGoogle);

router.post('/check-auth', CheckAuth)

router.patch('/change-settings', [
    body("currency").optional().isString().withMessage("Currency harus berupa string."),
    body("appearance").optional().isString().withMessage("Appearance harus berupa string."),
    body("language").optional().isString().withMessage("Language harus berupa string."),
    validateRequest
], changeSettings);


export default router;