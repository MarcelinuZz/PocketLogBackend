import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';
import formatDay from '../utils/formatDay.mjs';
import buildTransactionQuery from '../utils/buildTransactionQuery.mjs';

export const addTransactionIncomeExpense = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.headers['x-user-id'];
        const { amount, category_id, transaction_date, title, note, receipt_image_url, type, wallet_id } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: "Type harus 'income' atau 'expense'." });
        }

        await connection.beginTransaction();

        const transactionId = await randomizedIds('transactions');

        let from_wallet_id = null;
        let to_wallet_id = null;

        if (type === 'income') {
            to_wallet_id = wallet_id;
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ? AND user_id = ?',
                [amount, to_wallet_id, userId]
            );
        } else {
            from_wallet_id = wallet_id;
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ? AND user_id = ?',
                [amount, from_wallet_id, userId]
            );
        }

        const query = `
            INSERT INTO transactions (id, user_id, type, amount, category_id, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [
            transactionId, userId, type, amount, category_id,
            from_wallet_id, to_wallet_id, transaction_date, title,
            note || null, receipt_image_url || null
        ]);

        await connection.commit();

        res.status(201).json({
            message: "Transaksi berhasil ditambahkan",
            data: { id: transactionId, type, amount, category_id, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        await connection.rollback();
        console.error("[Transaction Controller Error - AddIncomeExpense]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan transaksi." });
    } finally {
        connection.release();
    }
};


export const addTransactionTransfer = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.headers['x-user-id'];
        const { amount, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (from_wallet_id === to_wallet_id) {
            return res.status(400).json({ message: "Wallet asal dan tujuan tidak boleh sama." });
        }

        await connection.beginTransaction();

        const transactionId = await randomizedIds('transactions');
        const type = 'transfer';
        const category_id = '7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e';

        await connection.query(
            'UPDATE wallets SET balance = balance - ? WHERE id = ? AND user_id = ?',
            [amount, from_wallet_id, userId]
        );

        await connection.query(
            'UPDATE wallets SET balance = balance + ? WHERE id = ? AND user_id = ?',
            [amount, to_wallet_id, userId]
        );

        const query = `
            INSERT INTO transactions (id, user_id, type, amount, category_id, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [
            transactionId, userId, type, amount, category_id,
            from_wallet_id, to_wallet_id, transaction_date, title,
            note || null, receipt_image_url || null
        ]);

        await connection.commit();

        res.status(201).json({
            message: "Transfer berhasil ditambahkan",
            data: { id: transactionId, type, amount, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        await connection.rollback();
        console.error("[Transaction Controller Error - AddTransfer]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan transfer." });
    } finally {
        connection.release();
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = buildTransactionQuery();
        const [rows] = await db.query(query, [userId]);

        const data = rows.map(row => ({
            ...row,
            day: formatDay(row.transaction_date)
        }));

        res.status(200).json({
            message: "Berhasil mengambil seluruh data transaksi",
            data
        });

    } catch (err) {
        console.error("[Transaction Controller Error - GetAll]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data transaksi." });
    }
};


export const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = buildTransactionQuery('', 'LIMIT 5');
        const [rows] = await db.query(query, [userId]);

        const data = rows.map(row => ({
            ...row,
            day: formatDay(row.transaction_date)
        }));

        res.status(200).json({
            message: "Berhasil mengambil transaksi terbaru",
            data
        });

    } catch (err) {
        console.error("[Transaction Controller Error - GetRecent]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil transaksi terbaru." });
    }
};


export const getTransactionDetail = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const query = buildTransactionQuery('AND t.id = ?');
        const [rows] = await db.query(query, [userId, id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        }

        res.status(200).json({
            message: "Berhasil mengambil detail transaksi",
            data: rows[0]
        });

    } catch (err) {
        console.error("[Transaction Controller Error - GetDetail]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail transaksi." });
    }
};


export const editTransactionIncomeExpense = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { amount, category_id, transaction_date, title, note, receipt_image_url, type, wallet_id } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: "Type harus 'income' atau 'expense'." });
        }

        const [oldRows] = await connection.query(
            'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (oldRows.length === 0) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        }

        const oldTx = oldRows[0];

        await connection.beginTransaction();

        if (oldTx.type === 'income' && oldTx.to_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                [oldTx.amount, oldTx.to_wallet_id]
            );
        } else if (oldTx.type === 'expense' && oldTx.from_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                [oldTx.amount, oldTx.from_wallet_id]
            );
        }

        let from_wallet_id = null;
        let to_wallet_id = null;

        if (type === 'income') {
            to_wallet_id = wallet_id;
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                [amount, to_wallet_id]
            );
        } else {
            from_wallet_id = wallet_id;
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                [amount, from_wallet_id]
            );
        }

        const query = `
            UPDATE transactions
            SET type = ?, amount = ?, category_id = ?, from_wallet_id = ?, to_wallet_id = ?,
                transaction_date = ?, title = ?, note = ?, receipt_image_url = ?
            WHERE id = ? AND user_id = ?
        `;

        await connection.query(query, [
            type, amount, category_id, from_wallet_id, to_wallet_id,
            transaction_date, title, note || null, receipt_image_url || null,
            id, userId
        ]);

        await connection.commit();

        res.status(200).json({
            message: "Transaksi berhasil diperbarui",
            data: { id, type, amount, category_id, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        await connection.rollback();
        console.error("[Transaction Controller Error - EditIncomeExpense]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui transaksi." });
    } finally {
        connection.release();
    }
};

export const editTransactionTransfer = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { amount, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (from_wallet_id === to_wallet_id) {
            return res.status(400).json({ message: "Wallet asal dan tujuan tidak boleh sama." });
        }

        const [oldRows] = await connection.query(
            'SELECT * FROM transactions WHERE id = ? AND user_id = ? AND type = ?',
            [id, userId, 'transfer']
        );

        if (oldRows.length === 0) {
            return res.status(404).json({ message: "Transaksi transfer tidak ditemukan." });
        }

        const oldTx = oldRows[0];

        await connection.beginTransaction();

        if (oldTx.from_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                [oldTx.amount, oldTx.from_wallet_id]
            );
        }
        if (oldTx.to_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                [oldTx.amount, oldTx.to_wallet_id]
            );
        }
        await connection.query(
            'UPDATE wallets SET balance = balance - ? WHERE id = ?',
            [amount, from_wallet_id]
        );
        await connection.query(
            'UPDATE wallets SET balance = balance + ? WHERE id = ?',
            [amount, to_wallet_id]
        );

        const query = `
            UPDATE transactions
            SET amount = ?, from_wallet_id = ?, to_wallet_id = ?,
                transaction_date = ?, title = ?, note = ?, receipt_image_url = ?
            WHERE id = ? AND user_id = ?
        `;

        await connection.query(query, [
            amount, from_wallet_id, to_wallet_id,
            transaction_date, title, note || null, receipt_image_url || null,
            id, userId
        ]);

        await connection.commit();

        res.status(200).json({
            message: "Transfer berhasil diperbarui",
            data: { id, type: 'transfer', amount, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        await connection.rollback();
        console.error("[Transaction Controller Error - EditTransfer]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui transfer." });
    } finally {
        connection.release();
    }
};

export const deleteTransaction = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        const [rows] = await connection.query(
            'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        }

        const tx = rows[0];

        await connection.beginTransaction();

        if (tx.type === 'income' && tx.to_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                [tx.amount, tx.to_wallet_id]
            );
        } else if (tx.type === 'expense' && tx.from_wallet_id) {
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                [tx.amount, tx.from_wallet_id]
            );
        } else if (tx.type === 'transfer') {
            if (tx.from_wallet_id) {
                await connection.query(
                    'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                    [tx.amount, tx.from_wallet_id]
                );
            }
            if (tx.to_wallet_id) {
                await connection.query(
                    'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                    [tx.amount, tx.to_wallet_id]
                );
            }
        }

        await connection.query('DELETE FROM transactions WHERE id = ?', [id]);

        await connection.commit();

        res.status(200).json({ message: "Transaksi berhasil dihapus dan saldo telah dikembalikan." });

    } catch (err) {
        await connection.rollback();
        console.error("[Transaction Controller Error - Delete]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus transaksi." });
    } finally {
        connection.release();
    }
};

export const getTransactionsByDate = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { date } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        if (!date) {
            return res.status(400).json({ message: "Query parameter 'date' wajib diisi (format: YYYY-MM-DD)." });
        }

        const query = buildTransactionQuery('AND DATE(t.transaction_date) = ?');
        const [rows] = await db.query(query, [userId, date]);

        const data = rows.map(row => ({
            ...row,
            day: formatDay(row.transaction_date)
        }));

        res.status(200).json({
            message: `Berhasil mengambil transaksi tanggal ${date}`,
            data
        });

    } catch (err) {
        console.error("[Transaction Controller Error - GetByDate]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil transaksi berdasarkan tanggal." });
    }
};

export const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { period } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        }

        let dateFilter = '';
        switch (period) {
            case 'week':
                dateFilter = 'AND t.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                break;
            case 'month':
                dateFilter = 'AND t.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
                break;
            case 'year':
                dateFilter = 'AND t.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
                break;
            default:
                dateFilter = '';
                break;
        }

        const query = `
            SELECT 
                c.id AS category_id,
                c.name AS category_name,
                c.icon_url AS category_icon_url,
                c.color_hex AS category_color_hex,
                SUM(t.amount) AS total_amount
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = 'expense' ${dateFilter}
            GROUP BY c.id, c.name, c.icon_url, c.color_hex
            ORDER BY total_amount DESC
        `;

        const [rows] = await db.query(query, [userId]);

        const grandTotal = rows.reduce((sum, row) => sum + parseFloat(row.total_amount), 0);

        const data = rows.map(row => ({
            category_id: row.category_id,
            category_name: row.category_name,
            category_icon_url: row.category_icon_url,
            category_color_hex: row.category_color_hex,
            total_amount: parseFloat(row.total_amount),
            percentage: grandTotal > 0 ? parseFloat(((parseFloat(row.total_amount) / grandTotal) * 100).toFixed(2)) : 0
        }));

        res.status(200).json({
            message: `Berhasil mengambil data breakdown kategori${period ? ` (${period})` : ''}`,
            period: period || 'all',
            grand_total_expense: grandTotal,
            data
        });

    } catch (err) {
        console.error("[Transaction Controller Error - CategoryBreakdown]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data breakdown kategori." });
    }
};
