import { Router } from "express";
import passport from "passport";
import db from '../utils/dbConfig.mjs';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import randomizedIds from "../utils/randomizedIds.mjs";
import crypto from "crypto";

const router = Router()

const authCodes = new Map();

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

            const payload = {
                sub: user.id
            };

            const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "zX9!vB4&tY7(uI0)PocketLog+dF9[gH2]jK5{lM8}nB1@mN5*qR8#pL2$kJ7^hG4";

            const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
            const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

            res.status(200).json({
                message: "Login Berhasil",
                accessToken: accessToken,
                refreshToken: refreshToken
            });

        } catch (err) {
            return res.status(500).json({
                message: "Login Gagal",
                error: err
            });
        }
    })

router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token tidak diberikan." });
    }

    try {
        const [blacklist] = await db.query('SELECT id FROM token_blacklist WHERE token_id = ?', [refreshToken]);
        if (blacklist.length > 0) {
            return res.status(403).json({ message: "Refresh token ini sudah ditarik (blacklisted)." });
        }
    } catch (err) {
        console.error("Refresh Token DB Error:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server saat memeriksa token." });
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "zX9!vB4&tY7(uI0)PocketLog+dF9[gH2]jK5{lM8}nB1@mN5*qR8#pL2$kJ7^hG4";

    jwt.verify(refreshToken, refreshSecret, (err, userPayload) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token tidak valid atau sudah kedaluwarsa." });
        }
        const payload = { sub: userPayload.sub };
        const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";

        const newAccessToken = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.status(200).json({
            message: "Token berhasil diperbarui",
            accessToken: newAccessToken
        });
    });
});

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

            let id = await randomizedIds();

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
                message: "Register Berhasil"
            });

        } catch (err) {
            return res.status(500).json({
                message: "Register Gagal",
                error: err.message || "Internal Server Error"
            });
        }
    })

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${frontendUrl}/login?error=google_auth_failed`,
    session: false
}), (req, res) => {
    const user = req.user;

    const authCode = crypto.randomBytes(32).toString('hex');

    const expiresAt = Date.now() + 5 * 60 * 1000;
    authCodes.set(authCode, {
        userId: user.id,
        expiresAt: expiresAt
    });

    setTimeout(() => {
        authCodes.delete(authCode);
    }, 5 * 60 * 1000);

    const flutterAppUrl = process.env.FLUTTER_APP_URL || "http://localhost:5173/Home";

    res.redirect(`${flutterAppUrl}?authCode=${authCode}`);
});

router.post("/exchange-token", [body("authCode").notEmpty().withMessage("authCode wajib diberikan.")], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Gagal menukar token", error: errors.array() });
    }

    const { authCode } = req.body;
    const codeData = authCodes.get(authCode);

    if (!codeData) {
        return res.status(400).json({ message: "Auth code tidak valid atau sudah kedaluwarsa." });
    }

    if (Date.now() > codeData.expiresAt) {
        authCodes.delete(authCode);
        return res.status(400).json({ message: "Auth code sudah kedaluwarsa." });
    }

    const payload = { sub: codeData.userId };
    console.log(payload)
    const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "zX9!vB4&tY7(uI0)PocketLog+dF9[gH2]jK5{lM8}nB1@mN5*qR8#pL2$kJ7^hG4";

    const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

    authCodes.delete(authCode);

    res.status(200).json({
        message: "Token berhasil ditukar",
        accessToken: accessToken,
        refreshToken: refreshToken
    });
});

router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.status(200).json({
        user: req.user
    });
});

router.post("/logout", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: "No token provided." });
        }

        const accessToken = authHeader.split(" ")[1];
        const decoded = jwt.decode(accessToken);

        if (decoded) {
            const expiresAt = new Date(decoded.exp * 1000).toISOString().slice(0, 19).replace('T', ' ');
            await db.query(
                `INSERT INTO token_blacklist (token_id, expires_at) VALUES (?, ?)`,
                [accessToken, expiresAt]
            );
        }

        const { refreshToken } = req.body;
        if (refreshToken) {
            const decodedRefresh = jwt.decode(refreshToken);
            if (decodedRefresh) {
                const refreshExpiresAt = new Date(decodedRefresh.exp * 1000).toISOString().slice(0, 19).replace('T', ' ');
                await db.query(
                    `INSERT INTO token_blacklist (token_id, expires_at) VALUES (?, ?)`,
                    [refreshToken, refreshExpiresAt]
                );
            }
        }

        res.status(200).json({
            message: "Logout Berhasil. Akses dihentikan secara permanen."
        });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Gagal menghapus sesi (logout)." });
    }
});

export default router