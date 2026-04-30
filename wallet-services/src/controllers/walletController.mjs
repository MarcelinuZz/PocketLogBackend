import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';

export const createWallet = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { name, account_number, balance, color_hex } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const walletId = await randomizedIds('wallets');

        const query = `
            INSERT INTO wallets (id, user_id, name, account_number, balance, color_hex)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [walletId, userId, name, account_number, balance, color_hex]);

        res.status(201).json({
            message: "Dompet berhasil dibuat",
            data: { walletId, name, account_number, balance, color_hex }
        });

    } catch (err) {
        console.error("[Wallet Controller Error - Create]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat dompet." });
    }
};

export const getAllWallets = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = `
            SELECT id, name, account_number, balance, color_hex, created_at
            FROM wallets
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(query, [userId]);

        res.status(200).json({
            message: "Berhasil mengambil data dompet",
            data: rows
        });

    } catch (err) {
        console.error("[Wallet Controller Error - Get]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data dompet." });
    }
};

export const getWalletById = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = `
            SELECT id, name, account_number, balance, color_hex, created_at
            FROM wallets
            WHERE id = ? AND user_id = ?
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(query, [id, userId]);

        res.status(200).json({
            message: "Berhasil mengambil data dompet",
            data: rows
        });

    } catch (err) {
        console.error("[Wallet Controller Error - Get]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data dompet." });
    }
};

export const editWallet = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { name, account_number, balance, color_hex } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = `
            UPDATE wallets
            SET name = ?, account_number = ?, balance = ?, color_hex = ?
            WHERE id = ? AND user_id = ?
        `;

        await db.query(query, [name, account_number, balance, color_hex, id, userId]);

        res.status(200).json({
            message: "Dompet berhasil diedit",
            data: { id, name, account_number, balance, color_hex }
        });

    } catch (err) {
        console.error("[Wallet Controller Error - Edit]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengedit dompet." });
    }
}

export const deleteWallet = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const checkQuery = `SELECT id FROM wallets WHERE id = ? AND user_id = ?`;
        const [existing] = await db.query(checkQuery, [id, userId]);

        if (existing.length === 0) {
            return res.status(404).json({ message: "Dompet tidak ditemukan atau bukan milik Anda." });
        }

        const deleteQuery = `DELETE FROM wallets WHERE id = ?`;
        await db.query(deleteQuery, [id]);

        res.status(200).json({ message: "Dompet berhasil dihapus." });

    } catch (err) {
        console.error("[Wallet Controller Error - Delete]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus dompet." });
    }
};
