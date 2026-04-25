import db from '../config/dbConfig.mjs';

export const getMe = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            SELECT id, name, email, gender, dob, avatar_url 
            FROM users 
            WHERE id = ?
        `;

        const [rows] = await db.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Data profil tidak ditemukan." });
        }

        res.status(200).json({
            message: "Berhasil memuat profil",
            data: rows[0]
        });

    } catch (err) {
        console.error("[User Controller Error]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memuat profil." });
    }
};

export const changeName = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { name } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            UPDATE users 
            SET name = ? 
            WHERE id = ?
        `;

        await db.query(query, [name, userId]);

        res.status(200).json({
            message: "Nama berhasil diubah",
            data: { name }
        });

    } catch (err) {
        console.error("[User Controller Error]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah nama." });
    }
}

export const changeGender = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { gender } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            UPDATE users 
            SET gender = ? 
            WHERE id = ?
        `;

        await db.query(query, [gender, userId]);

        res.status(200).json({
            message: "Gender berhasil diubah",
            data: { gender }
        });

    } catch (err) {
        console.error("[User Controller Error]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah gender." });
    }
}

export const changeDOB = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { dob } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            UPDATE users 
            SET dob = ? 
            WHERE id = ?
        `;

        await db.query(query, [dob, userId]);

        res.status(200).json({
            message: "Tanggal lahir berhasil diubah",
            data: { dob }
        });

    } catch (err) {
        console.error("[User Controller Error]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah tanggal lahir." });
    }
}

export const changeAvatarUrl = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { avatar_url } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        const query = `
            UPDATE users 
            SET avatar_url = ? 
            WHERE id = ?
        `;

        await db.query(query, [avatar_url, userId]);

        res.status(200).json({
            message: "URL avatar berhasil diubah",
            data: { avatar_url }
        });

    } catch (err) {
        console.error("[User Controller Error]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah URL avatar." });
    }
}