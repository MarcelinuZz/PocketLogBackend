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