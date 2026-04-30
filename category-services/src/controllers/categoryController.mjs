import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';

export const createCategory = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { name, icon_url, color_hex } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const categoryId = await randomizedIds('categories');

        const query = `
            INSERT INTO categories (id, user_id, name, icon_url, color_hex)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [categoryId, userId, name, icon_url, color_hex]);

        res.status(201).json({
            message: "Kategori berhasil dibuat",
            data: { id: categoryId, name, icon_url, color_hex }
        });

    } catch (err) {
        console.error("[Category Controller Error - Create]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat kategori." });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = `
            SELECT id, name, icon_url, color_hex
            FROM categories
            WHERE user_id = ? OR user_id IS NULL
        `;
        
        const [rows] = await db.query(query, [userId]);

        res.status(200).json({
            message: "Berhasil mengambil data kategori",
            data: rows
        });

    } catch (err) {
        console.error("[Category Controller Error - GetAll]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data kategori." });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = `
            SELECT id, name, icon_url, color_hex
            FROM categories
            WHERE id = ? AND (user_id = ? OR user_id IS NULL)
        `;
        
        const [rows] = await db.query(query, [id, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan." });
        }

        res.status(200).json({
            message: "Berhasil mengambil data kategori",
            data: rows[0]
        });

    } catch (err) {
        console.error("[Category Controller Error - GetById]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data kategori." });
    }
};

export const editCategory = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { name, icon_url, color_hex } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const checkQuery = `SELECT id FROM categories WHERE id = ? AND user_id = ?`;
        const [existing] = await db.query(checkQuery, [id, userId]);

        if (existing.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan atau bukan milik Anda (kategori default tidak dapat diubah)." });
        }

        const query = `
            UPDATE categories
            SET name = ?, icon_url = ?, color_hex = ?
            WHERE id = ? AND user_id = ?
        `;
        
        await db.query(query, [name, icon_url, color_hex, id, userId]);

        res.status(200).json({
            message: "Kategori berhasil diperbarui",
            data: { id, name, icon_url, color_hex }
        });

    } catch (err) {
        console.error("[Category Controller Error - Edit]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui kategori." });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const checkQuery = `SELECT id FROM categories WHERE id = ? AND user_id = ?`;
        const [existing] = await db.query(checkQuery, [id, userId]);

        if (existing.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan atau bukan milik Anda (kategori default tidak dapat dihapus)." });
        }

        const deleteQuery = `DELETE FROM categories WHERE id = ?`;
        await db.query(deleteQuery, [id]);

        res.status(200).json({ message: "Kategori berhasil dihapus." });

    } catch (err) {
        console.error("[Category Controller Error - Delete]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus kategori." });
    }
};
