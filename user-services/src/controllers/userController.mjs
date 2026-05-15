import db from '../config/dbConfig.mjs';

export const getSettings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);

        const settings = rows.length > 0
            ? rows[0]
            : { user_id: userId, currency: 'IDR', appearance: 'Light', language: 'English' };

        res.status(200).json({ message: "Berhasil mengambil pengaturan", data: settings });
    } catch (err) {
        console.error("[User Controller Error - getSettings]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil pengaturan." });
    }
};


export const changeSettings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { currency, appearance, language } = req.body;

        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        if (currency === undefined && appearance === undefined && language === undefined) {
            return res.status(400).json({ message: "Tidak ada pengaturan yang diubah." });
        }

        const [existing] = await db.query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);

        let newCurrency = currency;
        let newAppearance = appearance;
        let newLanguage = language;

        if (existing.length > 0) {
            const current = existing[0];
            if (newCurrency === undefined) newCurrency = current.currency;
            if (newAppearance === undefined) newAppearance = current.appearance;
            if (newLanguage === undefined) newLanguage = current.language;

            await db.query(
                'UPDATE user_settings SET currency = ?, appearance = ?, language = ? WHERE user_id = ?',
                [newCurrency, newAppearance, newLanguage, userId]
            );
        } else {
            if (newCurrency === undefined) newCurrency = 'IDR';
            if (newAppearance === undefined) newAppearance = 'Light';
            if (newLanguage === undefined) newLanguage = 'English';

            await db.query(
                'INSERT INTO user_settings (user_id, currency, appearance, language) VALUES (?, ?, ?, ?)',
                [userId, newCurrency, newAppearance, newLanguage]
            );
        }

        res.status(200).json({
            message: "Pengaturan berhasil diubah",
            data: { currency: newCurrency, appearance: newAppearance, language: newLanguage }
        });
    } catch (err) {
        console.error("[User Controller Error - changeSettings]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah pengaturan." });
    }
};


export const deleteUserSettingsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query('DELETE FROM user_settings WHERE user_id = ?', [userId]);
        res.status(200).json({ message: `Settings milik user ${userId} berhasil dihapus.` });
    } catch (err) {
        console.error("[User Internal Error - DeleteByUser]:", err);
        res.status(500).json({ message: "Internal error saat menghapus settings user." });
    }
};


export const initUserSettings = async (req, res) => {
    try {
        const { userId } = req.params;

        const [existing] = await db.query('SELECT user_id FROM user_settings WHERE user_id = ?', [userId]);
        if (existing.length > 0) {
            return res.status(200).json({ message: "Settings sudah ada." });
        }

        await db.query(
            "INSERT INTO user_settings (user_id, currency, appearance, language) VALUES (?, 'IDR', 'Light', 'English')",
            [userId]
        );

        res.status(201).json({ message: "Settings default berhasil dibuat." });
    } catch (err) {
        console.error("[User Internal Error - initSettings]:", err);
        res.status(500).json({ message: "Internal error saat membuat settings default." });
    }
};