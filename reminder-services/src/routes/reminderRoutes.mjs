import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createReminder, getAllReminders, getReminderDetail, editReminder, toggleReminder, deleteReminder } from '../controllers/reminderController.mjs';
import { createNotificationHistory, getNotificationHistory } from '../controllers/notificationHistoryController.mjs';

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

router.post('/create', [
    body("title").notEmpty().withMessage("Judul reminder wajib diisi."),
    body("time_scheduled").notEmpty().withMessage("Waktu alarm wajib diisi (format: HH:MM:SS)."),
    body("days_active").notEmpty().withMessage("Hari aktif wajib diisi (contoh: Monday,Tuesday)."),
    validateRequest
], createReminder);

router.get('/', getAllReminders);

router.get('/history', getNotificationHistory);

router.get('/:id', getReminderDetail);

router.put('/edit/:id', [
    body("title").notEmpty().withMessage("Judul reminder wajib diisi."),
    body("time_scheduled").notEmpty().withMessage("Waktu alarm wajib diisi (format: HH:MM:SS)."),
    body("days_active").notEmpty().withMessage("Hari aktif wajib diisi (contoh: Monday,Tuesday)."),
    validateRequest
], editReminder);

router.patch('/toggle/:id', toggleReminder);

router.delete('/delete/:id', deleteReminder);

router.post('/history/create', [
    body("title").notEmpty().withMessage("Judul notifikasi wajib diisi."),
    body("reminder_id").notEmpty().withMessage("ID reminder wajib diisi."),
    validateRequest
], createNotificationHistory);

export default router;
