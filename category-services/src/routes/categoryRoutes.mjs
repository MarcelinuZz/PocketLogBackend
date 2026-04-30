import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createCategory, getAllCategories, getCategoryById, editCategory, deleteCategory } from '../controllers/categoryController.mjs';

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

router.post('/create-category', [
    body("name").notEmpty().withMessage("Nama kategori tidak boleh kosong."),
    body("icon_url").notEmpty().withMessage("Icon URL kategori tidak boleh kosong."),
    body("color_hex").notEmpty().withMessage("Color Hex kategori tidak boleh kosong."),
    validateRequest
], createCategory);

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.put('/edit/:id', [
    body("name").notEmpty().withMessage("Nama kategori tidak boleh kosong."),
    body("icon_url").notEmpty().withMessage("Icon URL kategori tidak boleh kosong."),
    body("color_hex").notEmpty().withMessage("Color Hex kategori tidak boleh kosong."),
    validateRequest
], editCategory);

router.delete('/delete-category/:id', deleteCategory);

export default router;
