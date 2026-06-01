import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import deleteUploadedFile from "../utils/deleteUploadFile.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMe = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query(
            'SELECT u.id, u.name, u.email, u.gender, u.DOB as dob, u.avatar_url, up.hashed_password as password FROM users u LEFT JOIN user_passwords up ON u.id = up.user_id WHERE u.id = ?',
            [userId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Data profil tidak ditemukan." });

        res.status(200).json({ message: "Berhasil memuat profil", data: rows[0] });
    } catch (err) {
        console.error("[UserProfile Error - getMe]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memuat profil." });
    }
};

export const changeName = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { name } = req.body;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        await db.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        res.status(200).json({ message: "Nama berhasil diubah", data: { name } });
    } catch (err) {
        console.error("[UserProfile Error - changeName]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah nama." });
    }
};

export const changeGender = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { gender } = req.body;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        await db.query('UPDATE users SET gender = ? WHERE id = ?', [gender, userId]);
        res.status(200).json({ message: "Gender berhasil diubah", data: { gender } });
    } catch (err) {
        console.error("[UserProfile Error - changeGender]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah gender." });
    }
};

export const changeDOB = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { dob } = req.body;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        await db.query('UPDATE users SET DOB = ? WHERE id = ?', [dob, userId]);
        res.status(200).json({ message: "Tanggal lahir berhasil diubah", data: { dob } });
    } catch (err) {
        console.error("[UserProfile Error - changeDOB]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah tanggal lahir." });
    }
};

export const changeAvatarUrl = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            deleteUploadedFile(req);
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File avatar wajib diunggah." });
        }

        const newAvatarPath = `/public/avatars/${req.file.filename}`;

        const [rows] = await db.query('SELECT avatar_url FROM users WHERE id = ?', [userId]);
        const oldAvatarUrl = rows.length > 0 ? rows[0].avatar_url : null;

        await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [newAvatarPath, userId]);

        if (oldAvatarUrl && oldAvatarUrl.startsWith('/public/avatars/')) {
            const oldFilename = path.basename(oldAvatarUrl);
            const oldFilePath = path.join(__dirname, '../../public/avatars', oldFilename);
            fs.unlink(oldFilePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('[changeAvatarUrl] Gagal hapus file lama:', err);
                }
            });
        }

        res.status(200).json({ message: "Avatar berhasil diubah", data: { avatar_url: newAvatarPath } });
    } catch (err) {
        deleteUploadedFile(req);
        console.error("[UserProfile Error - changeAvatarUrl]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah avatar." });
    }
};

export const bindGoogle = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { googleIdToken } = req.body;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`);
        const data = await response.json();

        if (!response.ok || !data.sub) {
            return res.status(400).json({ message: "Token Google tidak valid." });
        }

        const providerId = data.sub;
        const [existingIdentity] = await db.query(
            "SELECT user_id FROM user_identities WHERE provider = 'google' AND provider_id = ?",
            [providerId]
        );

        if (existingIdentity.length > 0) {
            if (existingIdentity[0].user_id === userId) {
                return res.status(400).json({ message: "Akun Google ini sudah terhubung dengan akun Anda." });
            }
            return res.status(400).json({ message: "Akun Google ini sudah terhubung dengan pengguna lain." });
        }

        const identityId = await randomizedIds('user_identities');
        await db.query(
            "INSERT INTO user_identities (id, user_id, provider, provider_id) VALUES (?, ?, ?, ?)",
            [identityId, userId, 'google', providerId]
        );
        res.status(200).json({ message: "Akun Google berhasil dihubungkan." });
    } catch (err) {
        console.error("[UserProfile Error - bindGoogle]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghubungkan akun Google." });
    }
};

export const unbindGoogle = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [passwordRow] = await db.query("SELECT user_id FROM user_passwords WHERE user_id = ?", [userId]);
        if (passwordRow.length === 0) {
            return res.status(400).json({ message: "Anda tidak dapat memutus akun Google karena Anda belum membuat password lokal." });
        }

        const [result] = await db.query(
            "DELETE FROM user_identities WHERE user_id = ? AND provider = 'google'",
            [userId]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Tidak ada akun Google yang terhubung untuk diputus." });
        }
        res.status(200).json({ message: "Akun Google berhasil diputus." });
    } catch (err) {
        console.error("[UserProfile Error - unbindGoogle]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memutus akun Google." });
    }
};

export const CheckAuth = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [row] = await db.query(
            'SELECT u.id FROM users u JOIN user_passwords up ON u.id = up.user_id WHERE u.id = ?',
            [userId]
        );
        if (row.length === 0) return res.status(200).json({ message: "ProviderAuth" });
        res.status(200).json({ message: "LocalAuth" });
    } catch (err) {
        console.error("[UserProfile Error - CheckAuth]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengecek authentikasi user." });
    }
};

export const checkProviderStatus = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query(
            "SELECT provider_id FROM user_identities WHERE user_id = ? AND provider = 'google'",
            [userId]
        );

        const isBound = rows.length > 0;
        res.status(200).json({
            message: isBound ? "Akun Google sudah terhubung." : "Akun Google belum terhubung.",
            data: { google_bound: isBound }
        });
    } catch (err) {
        console.error("[UserProfile Error - checkProviderStatus]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengecek status provider." });
    }
};
