import db from '../config/dbConfig.mjs';
import randomizedIds from '../utils/randomizedIds.mjs';
import formatDay from '../utils/formatDay.mjs';
import buildTransactionQuery from '../utils/buildTransactionQuery.mjs';
import { adjustWalletBalance, getWalletById } from '../utils/walletClient.mjs';
import { getCategoryById, getCategoriesByIds } from '../utils/categoryClient.mjs';

async function enrichTransactions(rows) {
    const walletIds = new Set();
    const categoryIds = new Set();
    rows.forEach(row => {
        if (row.from_wallet_id) walletIds.add(row.from_wallet_id);
        if (row.to_wallet_id) walletIds.add(row.to_wallet_id);
        if (row.category_id) categoryIds.add(row.category_id);
    });

    const [walletResults, categoryResults] = await Promise.all([
        Promise.all([...walletIds].map(id => getWalletById(id).then(d => [id, d]))),
        Promise.all([...categoryIds].map(id => getCategoryById(id).then(d => [id, d])))
    ]);

    const walletMap = new Map(walletResults);
    const categoryMap = new Map(categoryResults);

    return rows.map(row => {
        const category = categoryMap.get(row.category_id) || null;
        const fromWallet = walletMap.get(row.from_wallet_id) || null;
        const toWallet = walletMap.get(row.to_wallet_id) || null;

        return {
            ...row,
            category_name: category?.name ?? null,
            category_icon_url: category?.icon_url ?? null,
            category_color_hex: category?.color_hex ?? null,
            from_wallet_name: fromWallet?.name ?? null,
            from_wallet_color_hex: fromWallet?.color_hex ?? null,
            to_wallet_name: toWallet?.name ?? null,
            to_wallet_color_hex: toWallet?.color_hex ?? null,
        };
    });
}


export const addTransactionIncomeExpense = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { amount, category_id, transaction_date, title, note, receipt_image_url, type, wallet_id } = req.body;

        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        if (!['income', 'expense'].includes(type)) return res.status(400).json({ message: "Type harus 'income' atau 'expense'." });

        const transactionId = await randomizedIds('transactions');
        let from_wallet_id = null;
        let to_wallet_id = null;
        const operation = type === 'income' ? 'add' : 'subtract';

        if (type === 'income') {
            to_wallet_id = wallet_id;
        } else {
            from_wallet_id = wallet_id;
        }

        await adjustWalletBalance(wallet_id, amount, operation);

        try {
            const query = `
                INSERT INTO transactions (id, user_id, type, amount, category_id, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, [
                transactionId, userId, type, amount, category_id,
                from_wallet_id, to_wallet_id, transaction_date, title,
                note || null, receipt_image_url || null
            ]);
        } catch (insertErr) {
            const reverseOp = operation === 'add' ? 'subtract' : 'add';
            await adjustWalletBalance(wallet_id, amount, reverseOp).catch(compErr =>
                console.error("[Saga Compensation FAILED - addIncomeExpense]:", compErr)
            );
            throw insertErr;
        }

        res.status(201).json({
            message: "Transaksi berhasil ditambahkan",
            data: { id: transactionId, type, amount, category_id, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        console.error("[Transaction Controller Error - AddIncomeExpense]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan transaksi." });
    }
};

export const addTransactionTransfer = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { amount, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url } = req.body;

        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        if (from_wallet_id === to_wallet_id) return res.status(400).json({ message: "Wallet asal dan tujuan tidak boleh sama." });

        const transactionId = await randomizedIds('transactions');
        const type = 'transfer';
        const category_id = '7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e'; 

        await adjustWalletBalance(from_wallet_id, amount, 'subtract');

        try {
            await adjustWalletBalance(to_wallet_id, amount, 'add');
        } catch (step2Err) {
            await adjustWalletBalance(from_wallet_id, amount, 'add').catch(compErr =>
                console.error("[Saga Compensation FAILED - addTransfer Step1]:", compErr)
            );
            throw step2Err;
        }

        try {
            const query = `
                INSERT INTO transactions (id, user_id, type, amount, category_id, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, [
                transactionId, userId, type, amount, category_id,
                from_wallet_id, to_wallet_id, transaction_date, title,
                note || null, receipt_image_url || null
            ]);
        } catch (insertErr) {
            await Promise.allSettled([
                adjustWalletBalance(from_wallet_id, amount, 'add'),
                adjustWalletBalance(to_wallet_id, amount, 'subtract')
            ]).then(results => {
                results.forEach((r, i) => {
                    if (r.status === 'rejected') console.error(`[Saga Compensation FAILED - addTransfer Step${i + 1}]:`, r.reason);
                });
            });
            throw insertErr;
        }

        res.status(201).json({
            message: "Transfer berhasil ditambahkan",
            data: { id: transactionId, type, amount, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        console.error("[Transaction Controller Error - AddTransfer]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan transfer." });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const { type } = req.query;
        const validTypes = ['income', 'expense', 'transfer'];

        if (type && !validTypes.includes(type)) {
            return res.status(400).json({ message: "Query parameter 'type' tidak valid. Gunakan: income, expense, atau transfer." });
        }

        const typeFilter = type ? 'AND type = ?' : '';
        const params = type ? [userId, type] : [userId];

        const [rows] = await db.query(buildTransactionQuery(typeFilter), params);
        const enriched = await enrichTransactions(rows);
        const data = enriched.map(row => ({ ...row, day: formatDay(row.transaction_date) }));

        const message = type
            ? `Berhasil mengambil transaksi dengan type '${type}'`
            : 'Berhasil mengambil seluruh data transaksi';

        res.status(200).json({ message, data });
    } catch (err) {
        console.error("[Transaction Controller Error - GetAll]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data transaksi." });
    }
};

export const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query(buildTransactionQuery('', 'LIMIT 5'), [userId]);
        const enriched = await enrichTransactions(rows);
        const data = enriched.map(row => ({ ...row, day: formatDay(row.transaction_date) }));

        res.status(200).json({ message: "Berhasil mengambil transaksi terbaru", data });
    } catch (err) {
        console.error("[Transaction Controller Error - GetRecent]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil transaksi terbaru." });
    }
};

export const getTransactionDetail = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query(buildTransactionQuery('AND id = ?'), [userId, id]);
        if (rows.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan." });

        const [enriched] = await enrichTransactions(rows);
        res.status(200).json({ message: "Berhasil mengambil detail transaksi", data: enriched });
    } catch (err) {
        console.error("[Transaction Controller Error - GetDetail]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail transaksi." });
    }
};

export const getTransactionsByDate = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { date } = req.query;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        if (!date) return res.status(400).json({ message: "Query parameter 'date' wajib diisi (format: YYYY-MM-DD)." });

        const [rows] = await db.query(buildTransactionQuery('AND DATE(transaction_date) = ?'), [userId, date]);
        const enriched = await enrichTransactions(rows);
        const data = enriched.map(row => ({ ...row, day: formatDay(row.transaction_date) }));

        res.status(200).json({ message: `Berhasil mengambil transaksi tanggal ${date}`, data });
    } catch (err) {
        console.error("[Transaction Controller Error - GetByDate]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil transaksi berdasarkan tanggal." });
    }
};

export const editTransactionIncomeExpense = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { amount, category_id, transaction_date, title, note, receipt_image_url, type, wallet_id } = req.body;

        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        if (!['income', 'expense'].includes(type)) return res.status(400).json({ message: "Type harus 'income' atau 'expense'." });

        const [oldRows] = await db.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
        if (oldRows.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        const oldTx = oldRows[0];

        let from_wallet_id = null;
        let to_wallet_id = null;

        if (oldTx.type === 'income' && oldTx.to_wallet_id) {
            await adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'subtract');
        } else if (oldTx.type === 'expense' && oldTx.from_wallet_id) {
            await adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'add');
        }

        const newOperation = type === 'income' ? 'add' : 'subtract';
        if (type === 'income') to_wallet_id = wallet_id;
        else from_wallet_id = wallet_id;

        try {
            await adjustWalletBalance(wallet_id, amount, newOperation);
        } catch (step2Err) {
            if (oldTx.type === 'income' && oldTx.to_wallet_id)
                await adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'add').catch(e => console.error("[Saga Compensation FAILED]:", e));
            else if (oldTx.type === 'expense' && oldTx.from_wallet_id)
                await adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'subtract').catch(e => console.error("[Saga Compensation FAILED]:", e));
            throw step2Err;
        }

        try {
            const query = `
                UPDATE transactions
                SET type = ?, amount = ?, category_id = ?, from_wallet_id = ?, to_wallet_id = ?,
                    transaction_date = ?, title = ?, note = ?, receipt_image_url = ?
                WHERE id = ? AND user_id = ?
            `;
            await db.query(query, [
                type, amount, category_id, from_wallet_id, to_wallet_id,
                transaction_date, title, note || null, receipt_image_url || null,
                id, userId
            ]);
        } catch (updateErr) {
            const reverseNewOp = newOperation === 'add' ? 'subtract' : 'add';
            await adjustWalletBalance(wallet_id, amount, reverseNewOp).catch(e => console.error("[Saga Compensation FAILED]:", e));
            if (oldTx.type === 'income' && oldTx.to_wallet_id)
                await adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'add').catch(e => console.error("[Saga Compensation FAILED]:", e));
            else if (oldTx.type === 'expense' && oldTx.from_wallet_id)
                await adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'subtract').catch(e => console.error("[Saga Compensation FAILED]:", e));
            throw updateErr;
        }

        res.status(200).json({
            message: "Transaksi berhasil diperbarui",
            data: { id, type, amount, category_id, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        console.error("[Transaction Controller Error - EditIncomeExpense]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui transaksi." });
    }
};

export const editTransactionTransfer = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { amount, from_wallet_id, to_wallet_id, transaction_date, title, note, receipt_image_url } = req.body;

        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });
        if (from_wallet_id === to_wallet_id) return res.status(400).json({ message: "Wallet asal dan tujuan tidak boleh sama." });

        const [oldRows] = await db.query('SELECT * FROM transactions WHERE id = ? AND user_id = ? AND type = ?', [id, userId, 'transfer']);
        if (oldRows.length === 0) return res.status(404).json({ message: "Transaksi transfer tidak ditemukan." });
        const oldTx = oldRows[0];

        const reverseOps = [];
        if (oldTx.from_wallet_id) reverseOps.push(adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'add'));
        if (oldTx.to_wallet_id) reverseOps.push(adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'subtract'));
        await Promise.all(reverseOps);

        try {
            await adjustWalletBalance(from_wallet_id, amount, 'subtract');
            await adjustWalletBalance(to_wallet_id, amount, 'add');
        } catch (step2Err) {
            const compOps = [];
            if (oldTx.from_wallet_id) compOps.push(adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'subtract').catch(e => console.error("[Saga Compensation FAILED]:", e)));
            if (oldTx.to_wallet_id) compOps.push(adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'add').catch(e => console.error("[Saga Compensation FAILED]:", e)));
            await Promise.allSettled(compOps);
            throw step2Err;
        }

        try {
            const query = `
                UPDATE transactions
                SET amount = ?, from_wallet_id = ?, to_wallet_id = ?,
                    transaction_date = ?, title = ?, note = ?, receipt_image_url = ?
                WHERE id = ? AND user_id = ?
            `;
            await db.query(query, [
                amount, from_wallet_id, to_wallet_id,
                transaction_date, title, note || null, receipt_image_url || null,
                id, userId
            ]);
        } catch (updateErr) {
            await Promise.allSettled([
                adjustWalletBalance(from_wallet_id, amount, 'add'),
                adjustWalletBalance(to_wallet_id, amount, 'subtract'),
                ...(oldTx.from_wallet_id ? [adjustWalletBalance(oldTx.from_wallet_id, oldTx.amount, 'subtract')] : []),
                ...(oldTx.to_wallet_id ? [adjustWalletBalance(oldTx.to_wallet_id, oldTx.amount, 'add')] : [])
            ]).then(results => results.forEach((r, i) => {
                if (r.status === 'rejected') console.error(`[Saga Compensation FAILED - editTransfer Step${i}]:`, r.reason);
            }));
            throw updateErr;
        }

        res.status(200).json({
            message: "Transfer berhasil diperbarui",
            data: { id, type: 'transfer', amount, from_wallet_id, to_wallet_id, title }
        });

    } catch (err) {
        console.error("[Transaction Controller Error - EditTransfer]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui transfer." });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        const [rows] = await db.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
        if (rows.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        const tx = rows[0];

        const reverseOps = [];
        if (tx.type === 'income' && tx.to_wallet_id) {
            reverseOps.push(adjustWalletBalance(tx.to_wallet_id, tx.amount, 'subtract'));
        } else if (tx.type === 'expense' && tx.from_wallet_id) {
            reverseOps.push(adjustWalletBalance(tx.from_wallet_id, tx.amount, 'add'));
        } else if (tx.type === 'transfer') {
            if (tx.from_wallet_id) reverseOps.push(adjustWalletBalance(tx.from_wallet_id, tx.amount, 'add'));
            if (tx.to_wallet_id) reverseOps.push(adjustWalletBalance(tx.to_wallet_id, tx.amount, 'subtract'));
        }
        await Promise.all(reverseOps);

        try {
            await db.query('DELETE FROM transactions WHERE id = ?', [id]);
        } catch (deleteErr) {
            const compOps = [];
            if (tx.type === 'income' && tx.to_wallet_id) compOps.push(adjustWalletBalance(tx.to_wallet_id, tx.amount, 'add'));
            else if (tx.type === 'expense' && tx.from_wallet_id) compOps.push(adjustWalletBalance(tx.from_wallet_id, tx.amount, 'subtract'));
            else if (tx.type === 'transfer') {
                if (tx.from_wallet_id) compOps.push(adjustWalletBalance(tx.from_wallet_id, tx.amount, 'subtract'));
                if (tx.to_wallet_id) compOps.push(adjustWalletBalance(tx.to_wallet_id, tx.amount, 'add'));
            }
            await Promise.allSettled(compOps).then(results =>
                results.forEach((r, i) => { if (r.status === 'rejected') console.error(`[Saga Compensation FAILED - deleteTransaction]:`, r.reason); })
            );
            throw deleteErr;
        }

        res.status(200).json({ message: "Transaksi berhasil dihapus dan saldo telah dikembalikan." });

    } catch (err) {
        console.error("[Transaction Controller Error - Delete]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus transaksi." });
    }
};


export const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { period } = req.query;
        if (!userId) return res.status(401).json({ message: "Akses ditolak. Identitas tidak ditemukan dari Gateway." });

        let dateFilter = '';
        switch (period) {
            case 'week':  dateFilter = "AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"; break;
            case 'month': dateFilter = "AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)"; break;
            case 'year':  dateFilter = "AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)"; break;
            default: dateFilter = ''; break;
        }

        const query = `
            SELECT category_id, SUM(amount) AS total_amount
            FROM transactions
            WHERE user_id = ? AND type = 'expense' ${dateFilter}
            GROUP BY category_id
            ORDER BY total_amount DESC
        `;
        const [rows] = await db.query(query, [userId]);

        const categoryIds = rows.map(r => r.category_id).filter(Boolean);
        const categoryMap = await getCategoriesByIds(categoryIds);

        const grandTotal = rows.reduce((sum, row) => sum + parseFloat(row.total_amount), 0);

        const data = rows.map(row => {
            const cat = categoryMap.get(row.category_id) || {};
            const total = parseFloat(row.total_amount);
            return {
                category_id: row.category_id,
                category_name: cat.name ?? null,
                category_icon_url: cat.icon_url ?? null,
                category_color_hex: cat.color_hex ?? null,
                total_amount: total,
                percentage: grandTotal > 0 ? parseFloat(((total / grandTotal) * 100).toFixed(2)) : 0
            };
        });

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


export const deleteTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query('DELETE FROM transactions WHERE user_id = ?', [userId]);
        res.status(200).json({ message: `Semua transaksi milik user ${userId} berhasil dihapus.` });
    } catch (err) {
        console.error("[Transaction Internal Error - DeleteByUser]:", err);
        res.status(500).json({ message: "Internal error saat menghapus transaksi user." });
    }
};
