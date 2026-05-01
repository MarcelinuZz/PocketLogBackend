import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';

export const createReminder = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { title, note, time_scheduled, days_active } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const reminderId = await randomizedIds('reminders');

        const query = `
            INSERT INTO reminders (id, user_id, title, note, time_scheduled, days_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            reminderId, userId, title, note || null, time_scheduled, days_active
        ]);

        res.status(201).json({
            message: "Reminder berhasil dibuat",
            data: {
                id: reminderId,
                title,
                note: note || null,
                time_scheduled,
                days_active,
                is_active: true
            }
        });

    } catch (err) {
        console.error("[Reminder Controller Error - Create]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat reminder." });
    }
};

export const getAllReminders = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            SELECT id, title, note, time_scheduled, days_active, is_active, created_at
            FROM reminders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(query, [userId]);

        res.status(200).json({
            message: "Berhasil mengambil semua reminder",
            data: rows
        });

    } catch (err) {
        console.error("[Reminder Controller Error - GetAll]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data reminder." });
    }
};

export const getReminderDetail = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            SELECT id, title, note, time_scheduled, days_active, is_active, created_at
            FROM reminders
            WHERE id = ? AND user_id = ?
        `;

        const [rows] = await db.query(query, [id, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Reminder tidak ditemukan." });
        }

        res.status(200).json({
            message: "Berhasil mengambil detail reminder",
            data: rows[0]
        });

    } catch (err) {
        console.error("[Reminder Controller Error - GetDetail]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail reminder." });
    }
};

export const editReminder = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { title, note, time_scheduled, days_active } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM reminders WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Reminder tidak ditemukan." });
        }

        const query = `
            UPDATE reminders
            SET title = ?, note = ?, time_scheduled = ?, days_active = ?
            WHERE id = ? AND user_id = ?
        `;

        await db.query(query, [
            title, note || null, time_scheduled, days_active, id, userId
        ]);

        res.status(200).json({
            message: "Reminder berhasil diperbarui",
            data: { id, title, note: note || null, time_scheduled, days_active }
        });

    } catch (err) {
        console.error("[Reminder Controller Error - Edit]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui reminder." });
    }
};

export const toggleReminder = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const [existing] = await db.query(
            "SELECT id, is_active FROM reminders WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Reminder tidak ditemukan." });
        }

        await db.query(
            "UPDATE reminders SET is_active = NOT is_active WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        const newStatus = !existing[0].is_active;

        res.status(200).json({
            message: "Status reminder berhasil diubah",
            data: { id, is_active: newStatus }
        });

    } catch (err) {
        console.error("[Reminder Controller Error - Toggle]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah status reminder." });
    }
};

export const deleteReminder = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM reminders WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Reminder tidak ditemukan." });
        }

        await db.query("DELETE FROM reminders WHERE id = ? AND user_id = ?", [id, userId]);

        res.status(200).json({ message: "Reminder berhasil dihapus." });

    } catch (err) {
        console.error("[Reminder Controller Error - Delete]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus reminder." });
    }
};
