import { Router } from "express";
import passport from "passport";
import { randomUUID } from 'node:crypto';
import db from '../utils/dbConfig.mjs';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const router = Router()

const authenticateAsync = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err) return reject(err);
            resolve({ user, info });
        })(req, res, next);
    });
};

router.post("/login-local", 
    [
        body("username").notEmpty().withMessage("Username wajib diisi."),
        body("password").notEmpty().withMessage("Password wajib diisi.")
    ],
    async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Login Gagal",
            error: errors.array()
        });
    }

    try {
        const { user, info } = await authenticateAsync(req, res, next);

        if (!user) {
            return res.status(401).json({
                message: "Login Gagal",
                error: info
            });
        }

        res.status(200).json({
            message: "Login Berhasil",
            user: user
        });

    } catch (err) {
        return res.status(500).json({
            message: "Login Gagal",
            error: err
        });
    }
})

router.post("/register-local",
    [
        body("name").notEmpty().withMessage("Nama wajib diisi."),
        body("email").isEmail().withMessage("Format email salah/tidak valid."),
        body("gender").notEmpty().withMessage("Gender wajib diisi."),
        body("dob").isDate().withMessage("Format tanggal salah.").notEmpty().withMessage("Tanggal lahir wajib diisi."),
        body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter.")
    ],
    async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Register Gagal",
            error: errors.array()
        });
    }

    try {
        const { name, gender, dob, email, avatarUrl, password } = req.body;

        let id;
        let isIdUnique = false;

        while (!isIdUnique) {
            id = randomUUID();
            const [existingRows] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
            if (existingRows.length === 0) {
                isIdUnique = true;
            }
        }

        const query = `
            INSERT INTO users (id, name, gender, dob, email, avatar_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [id, name, gender, dob, email, avatarUrl]);

        const query2 = `
            INSERT INTO user_passwords (user_id, hashed_password) 
            VALUES (?, ?)
        `;

        const hashedPassword = await bcrypt.hash(password, 11);

        const [result2] = await db.query(query2, [id, hashedPassword]);

        res.status(200).json({
            message: "Register Berhasil",
            user: { id, name }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Register Gagal",
            error: err.message || "Internal Server Error"
        });
    }
})

export default router