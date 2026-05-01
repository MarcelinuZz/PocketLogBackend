import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';
import formatDay from '../utils/formatDay.mjs';

export const createNotificationHistory = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { reminder_id, title, note } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const historyId = await randomizedIds('notification_history');

        const query = `
            INSERT INTO notification_history (id, user_id, reminder_id, title, note)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            historyId, userId, reminder_id, title, note || null
        ]);

        res.status(201).json({
            message: "History notifikasi berhasil dicatat",
            data: {
                id: historyId,
                reminder_id: reminder_id,
                title,
                note: note || null
            }
        });

    } catch (err) {
        console.error("[Notification History Controller Error - Create]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mencatat history notifikasi." });
    }
};

export const getNotificationHistory = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            SELECT 
                nh.id, nh.reminder_id, nh.title, nh.note, nh.created_at,
                r.time_scheduled, r.days_active
            FROM notification_history nh
            LEFT JOIN reminders r ON nh.reminder_id = r.id
            WHERE nh.user_id = ? AND nh.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ORDER BY nh.created_at DESC
        `;

        const [rows] = await db.query(query, [userId]);

        const data = rows.map(row => ({
            ...row,
            day: formatDay(row.created_at)
        }));

        res.status(200).json({
            message: "Berhasil mengambil history notifikasi 7 hari terakhir",
            data
        });

    } catch (err) {
        console.error("[Notification History Controller Error - GetHistory]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil history notifikasi." });
    }
};
