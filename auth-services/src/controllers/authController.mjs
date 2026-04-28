import passport from "passport";
import db from '../config/dbConfig.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import randomizedIds from "../utils/randomizedIds.mjs";
import crypto from "crypto";
import generateOTP from "../utils/generateOTP.mjs";
import signChallengeToken from "../utils/signChallengeToken.mjs";
import sendOTPViaEmailService from "../utils/sendOTPViaEmailServices.mjs";
import verifyChallengeToken from "../utils/verifyChalengeToken.mjs";

export const authCodes = new Map();

const authenticateAsync = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err) return reject(err);
            resolve({ user, info });
        })(req, res, next);
    });
};

export const loginLocal = async (req, res, next) => {
    try {
        const { user, info } = await authenticateAsync(req, res, next);
        if (!user) {
            return res.status(401).json({ message: "Login Gagal", error: info });
        }

        const payload = { sub: user.id };
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
        return res.status(500).json({ message: "Login Gagal", error: err });
    }
};

export const VerifyEmailReq = async (req, res) => {
    try {
        const { email } = req.body;

        const [ValidEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (ValidEmail.length !== 0) {
            return res.status(409).json({ message: "Email Sudah Terdaftar" });
        }

        const OTP = generateOTP();
        const expiretAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query("DELETE FROM register_otps WHERE email = ?", [email])
        await db.query("INSERT INTO register_otps (email, otp_code, expires_at) VALUES (?, ?, ?)", [email, OTP, expiretAt])

        await sendOTPViaEmailService(email, OTP, "verify_email");

        const challengeToken = signChallengeToken(email, "verify_email")

        res.status(200).json({
            message: "Kode OTP berhasil dikirim",
            challengeToken
        })

    } catch (err) {
        return res.status(500).json({ message: "Gagal Verifikasi Email", error: err.message })
    }
}

export const registerLocal = async (req, res, next) => {
    try {
        const { name, gender, dob, email, avatarUrl, password, challengeToken, otpCode } = req.body;
        let id = await randomizedIds();

        const verify = verifyChallengeToken(challengeToken, "verify_email", email);
        if (!verify.valid) {
            return res.status(400).json({ message: verify.message });
        }

        const [row] = await db.query("SELECT email FROM register_otps WHERE email = ? AND otp_code = ? AND expires_at > NOW()", [email, otpCode]);
        if (row.length === 0) {
            return res.status(400).json({ message: "Kode OTP tidak valid atau kadaluarsa." });
        }

        const [ValidEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (ValidEmail.length !== 0) {
            return res.status(409).json({ message: "Email Sudah Terdaftar" });
        }

        const query = `INSERT INTO users (id, name, gender, dob, email, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(query, [id, name, gender, dob, email, avatarUrl]);

        const query2 = `INSERT INTO user_passwords (user_id, hashed_password) VALUES (?, ?)`;
        const hashedPassword = await bcrypt.hash(password, 11);
        await db.query(query2, [id, hashedPassword]);

        await db.query("DELETE FROM register_otps WHERE email = ?", [email]);

        res.status(200).json({ message: "Register Berhasil" });
    } catch (err) {
        return res.status(500).json({ message: "Register Gagal", error: err.message });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token tidak diberikan." });

    try {
        const [blacklist] = await db.query('SELECT id FROM token_blacklist WHERE token_id = ?', [refreshToken]);
        if (blacklist.length > 0) return res.status(403).json({ message: "Refresh token sudah ditarik." });
    } catch (err) {
        return res.status(500).json({ message: "Kesalahan server saat memeriksa token." });
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "zX9!vB4&tY7(uI0)PocketLog+dF9[gH2]jK5{lM8}nB1@mN5*qR8#pL2$kJ7^hG4";
    jwt.verify(refreshToken, refreshSecret, (err, userPayload) => {
        if (err) return res.status(403).json({ message: "Refresh token tidak valid." });
        const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";
        const newAccessToken = jwt.sign({ sub: userPayload.sub }, secret, { expiresIn: '1h' });
        res.status(200).json({ message: "Token diperbarui", accessToken: newAccessToken });
    });
};

export const googleCallback = (req, res) => {
    const authCode = crypto.randomBytes(32).toString('hex');
    authCodes.set(authCode, { userId: req.user.id, expiresAt: Date.now() + 5 * 60 * 1000 });
    setTimeout(() => authCodes.delete(authCode), 5 * 60 * 1000);

    const flutterAppUrl = process.env.FLUTTER_APP_URL || "http://localhost:5173/Home";
    res.redirect(`${flutterAppUrl}?authCode=${authCode}`);
};

export const exchangeToken = (req, res) => {
    const { authCode } = req.body;
    const codeData = authCodes.get(authCode);

    if (!codeData || Date.now() > codeData.expiresAt) {
        if (codeData) authCodes.delete(authCode);
        return res.status(400).json({ message: "Auth code tidak valid atau kedaluwarsa." });
    }

    const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "zX9!vB4&tY7(uI0)PocketLog+dF9[gH2]jK5{lM8}nB1@mN5*qR8#pL2$kJ7^hG4";

    const accessToken = jwt.sign({ sub: codeData.userId }, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: codeData.userId }, refreshSecret, { expiresIn: '7d' });
    authCodes.delete(authCode);

    res.status(200).json({ message: "Token ditukar", accessToken, refreshToken });
};

export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const { refreshToken } = req.body;

        if (!authHeader || !refreshToken) {
            return res.status(400).json({
                message: "Logout gagal. Access Token dan Refresh Token wajib disertakan!"
            });
        }

        const accessToken = authHeader.split(" ")[1];

        const decodedAccess = jwt.decode(accessToken);
        const decodedRefresh = jwt.decode(refreshToken);

        if (!decodedAccess || !decodedRefresh) {
            return res.status(400).json({ message: "Format token tidak valid." });
        }

        if (decodedAccess.sub !== decodedRefresh.sub) {
            return res.status(403).json({
                message: "Akses ditolak. Refresh Token tidak cocok dengan Access Token."
            });
        }

        const accessExpiresAt = new Date(decodedAccess.exp * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await db.query(`INSERT INTO token_blacklist (token_id, expires_at) VALUES (?, ?)`, [accessToken, accessExpiresAt]);

        const refreshExpiresAt = new Date(decodedRefresh.exp * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await db.query(`INSERT INTO token_blacklist (token_id, expires_at) VALUES (?, ?)`, [refreshToken, refreshExpiresAt]);

        res.status(200).json({ message: "Logout Berhasil. Semua akses dihentikan." });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus sesi (logout)." });
    }
};