import { Router } from 'express';
import { getMe, changeName, changeGender, changeDOB, changeAvatarUrl } from '../controllers/userController.mjs';

const router = Router();

router.get('/me', getMe);
router.post('/change-name', changeName);
router.post('/change-gender', changeGender);
router.post('/change-dob', changeDOB);
router.post('/change-avatar-url', changeAvatarUrl);

export default router;