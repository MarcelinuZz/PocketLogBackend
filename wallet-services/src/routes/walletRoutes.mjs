import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createWallet, getAllWallets, deleteWallet, getWalletById, editWallet } from '../controllers/walletController.mjs';

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

router.post('/create-wallet/', [
    body("name").notEmpty().withMessage("Nama dompet tidak boleh kosong."),
    body("account_number").notEmpty().withMessage("Nomor rekening tidak boleh kosong."),
    body("balance").notEmpty().withMessage("Saldo tidak boleh kosong."),
    body("color_hex").notEmpty().withMessage("Warna dompet tidak boleh kosong."),
    validateRequest
], createWallet);

router.get('/', getAllWallets);

router.get('/:id', getWalletById);

router.delete('/delete-wallet/:id', deleteWallet);

router.put('/edit/:id', [
    body("name").notEmpty().withMessage("Nama dompet tidak boleh kosong."),
    body("account_number").notEmpty().withMessage("Nomor rekening tidak boleh kosong."),
    body("balance").notEmpty().withMessage("Saldo tidak boleh kosong."),
    body("color_hex").notEmpty().withMessage("Warna dompet tidak boleh kosong."),
    validateRequest
], editWallet)

export default router;
