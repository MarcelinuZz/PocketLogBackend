import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getSettings, changeSettings, deleteUserSettingsByUserId, initUserSettings } from '../controllers/userController.mjs';
import { internalAuth } from '../middleware/internalAuthMiddleware.mjs';

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

router.get('/settings', getSettings);

router.patch('/change-settings', [
    body("currency").optional().isString().withMessage("Currency harus berupa string."),
    body("appearance").optional().isString().withMessage("Appearance harus berupa string."),
    body("language").optional().isString().withMessage("Language harus berupa string."),
    validateRequest
], changeSettings);


router.delete('/internal/by-user/:userId', internalAuth, deleteUserSettingsByUserId);
router.post('/internal/init-settings/:userId', internalAuth, initUserSettings);

export default router;