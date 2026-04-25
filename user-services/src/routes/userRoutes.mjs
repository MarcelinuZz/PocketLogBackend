import { Router } from 'express';
import { getMe, changeName, changeGender, changeDOB, changeAvatarUrl } from '../controllers/userController.mjs';
import {
    requestChangePasswordOTP, confirmChangePassword,
    requestChangeEmailOTP, confirmChangeEmail,
    requestDeleteAccountOTP, confirmDeleteAccount
} from '../controllers/otpController.mjs';

const router = Router();

router.get('/me', getMe);
router.post('/change-name', changeName);
router.post('/change-gender', changeGender);
router.post('/change-dob', changeDOB);
router.post('/change-avatar-url', changeAvatarUrl);

router.post('/change-password/request-otp', requestChangePasswordOTP);
router.post('/change-password/confirm', confirmChangePassword);
router.post('/change-email/request-otp', requestChangeEmailOTP);
router.post('/change-email/confirm', confirmChangeEmail);
router.post('/delete-account/request-otp', requestDeleteAccountOTP);
router.post('/delete-account/confirm', confirmDeleteAccount);

export default router;