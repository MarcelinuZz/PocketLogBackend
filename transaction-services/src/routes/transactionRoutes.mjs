import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    addTransactionIncomeExpense, addTransactionTransfer,
    getAllTransactions, getRecentTransactions, getTransactionDetail,
    getTransactionsByDate, editTransactionIncomeExpense, editTransactionTransfer,
    deleteTransaction, getCategoryBreakdown
} from '../controllers/transactionController.mjs';

const router = Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validasi Gagal",
            error: errors.array()
        });
    }
    next();
};

router.post('/create', [
    body("amount").isFloat({ gt: 0 }).withMessage("Amount harus berupa angka lebih dari 0."),
    body("category_id").notEmpty().withMessage("Kategori wajib diisi."),
    body("transaction_date").notEmpty().withMessage("Tanggal transaksi wajib diisi."),
    body("title").notEmpty().withMessage("Judul transaksi wajib diisi."),
    body("type").isIn(['income', 'expense']).withMessage("Type harus 'income' atau 'expense'."),
    body("wallet_id").notEmpty().withMessage("Wallet ID wajib diisi."),
    validateRequest
], addTransactionIncomeExpense);

router.post('/create-transfer', [
    body("amount").isFloat({ gt: 0 }).withMessage("Amount harus berupa angka lebih dari 0."),
    body("from_wallet_id").notEmpty().withMessage("Wallet asal wajib diisi."),
    body("to_wallet_id").notEmpty().withMessage("Wallet tujuan wajib diisi."),
    body("transaction_date").notEmpty().withMessage("Tanggal transaksi wajib diisi."),
    body("title").notEmpty().withMessage("Judul transaksi wajib diisi."),
    validateRequest
], addTransactionTransfer);

router.get('/', getAllTransactions);

router.get('/recent', getRecentTransactions);

router.get('/category-breakdown', getCategoryBreakdown);

router.get('/by-date', getTransactionsByDate);

router.get('/:id', getTransactionDetail);

router.put('/edit/:id', [
    body("amount").isFloat({ gt: 0 }).withMessage("Amount harus berupa angka lebih dari 0."),
    body("category_id").notEmpty().withMessage("Kategori wajib diisi."),
    body("transaction_date").notEmpty().withMessage("Tanggal transaksi wajib diisi."),
    body("title").notEmpty().withMessage("Judul transaksi wajib diisi."),
    body("type").isIn(['income', 'expense']).withMessage("Type harus 'income' atau 'expense'."),
    body("wallet_id").notEmpty().withMessage("Wallet ID wajib diisi."),
    validateRequest
], editTransactionIncomeExpense);

router.put('/edit-transfer/:id', [
    body("amount").isFloat({ gt: 0 }).withMessage("Amount harus berupa angka lebih dari 0."),
    body("from_wallet_id").notEmpty().withMessage("Wallet asal wajib diisi."),
    body("to_wallet_id").notEmpty().withMessage("Wallet tujuan wajib diisi."),
    body("transaction_date").notEmpty().withMessage("Tanggal transaksi wajib diisi."),
    body("title").notEmpty().withMessage("Judul transaksi wajib diisi."),
    validateRequest
], editTransactionTransfer);

router.delete('/delete/:id', deleteTransaction);

export default router;
