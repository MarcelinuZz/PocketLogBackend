import db from '../config/dbConfig.mjs';
import bcrypt from 'bcrypt';
import generateOTP from '../utils/generateOTP.mjs';
import sendOTPViaEmailService from '../utils/sendOTPViaEmailServices.mjs';
import signChallengeToken from '../utils/signChallengeToken.mjs';
import verifyChallengeToken from '../utils/verifyChallengeToken.mjs';

export const requestChangePasswordOTP = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { oldPassword } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!oldPassword) {
            return res.status(400).json({ message: "Password lama wajib diisi." });
        }

        const [passwordRows] = await db.query(
            'SELECT hashed_password FROM user_passwords WHERE user_id = ?',
            [userId]
        );

        if (passwordRows.length === 0) {
            return res.status(404).json({ message: "Data password tidak ditemukan. Akun ini mungkin terdaftar via Google." });
        }

        const isMatch = await bcrypt.compare(oldPassword, passwordRows[0].hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password lama salah." });
        }

        const [userRows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        await db.query(
            'DELETE FROM otp_verifications WHERE user_id = ? AND action_type = ?',
            [userId, 'change_password']
        );

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query(
            'INSERT INTO otp_verifications (user_id, otp_code, action_type, expires_at) VALUES (?, ?, ?, ?)',
            [userId, otpCode, 'change_password', expiresAt]
        );

        await sendOTPViaEmailService(userRows[0].email, otpCode, 'change_password');

        const challengeToken = signChallengeToken(userId, 'change_password');

        res.status(200).json({
            message: "Kode OTP telah dikirim ke email Anda.",
            challengeToken
        });

    } catch (err) {
        console.error("[OTP Controller Error - Change Password Request]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim OTP." });
    }
};

export const confirmChangePassword = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { otpCode, newPassword, challengeToken } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!otpCode || !newPassword || !challengeToken) {
            return res.status(400).json({ message: "Kode OTP, password baru, dan challenge token wajib diisi." });
        }

        const tokenResult = verifyChallengeToken(challengeToken, 'change_password', userId);
        if (!tokenResult.valid) {
            return res.status(403).json({ message: tokenResult.message });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password baru minimal 6 karakter." });
        }

        const [otpRows] = await db.query(
            'SELECT id FROM otp_verifications WHERE user_id = ? AND otp_code = ? AND action_type = ? AND expires_at > NOW()',
            [userId, otpCode, 'change_password']
        );

        if (otpRows.length === 0) {
            return res.status(400).json({ message: "Kode OTP tidak valid atau sudah kedaluwarsa." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 11);
        await db.query(
            'UPDATE user_passwords SET hashed_password = ? WHERE user_id = ?',
            [hashedPassword, userId]
        );

        await db.query(
            'DELETE FROM otp_verifications WHERE user_id = ? AND action_type = ?',
            [userId, 'change_password']
        );

        res.status(200).json({ message: "Password berhasil diubah." });

    } catch (err) {
        console.error("[OTP Controller Error - Change Password Confirm]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah password." });
    }
};

export const requestChangeEmailOTP = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { newEmail } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!newEmail) {
            return res.status(400).json({ message: "Email baru wajib diisi." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: "Format email tidak valid." });
        }

        const [existingEmail] = await db.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [newEmail, userId]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: "Email sudah digunakan oleh akun lain." });
        }

        const [userRows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        if (userRows[0].email === newEmail) {
            return res.status(400).json({ message: "Email baru tidak boleh sama dengan email saat ini." });
        }

        await db.query(
            'DELETE FROM otp_verifications WHERE user_id = ? AND action_type = ?',
            [userId, 'change_email']
        );

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query(
            'INSERT INTO otp_verifications (user_id, otp_code, action_type, target_value, expires_at) VALUES (?, ?, ?, ?, ?)',
            [userId, otpCode, 'change_email', newEmail, expiresAt]
        );

        await sendOTPViaEmailService(userRows[0].email, otpCode, 'change_email');

        const challengeToken = signChallengeToken(userId, 'change_email');

        res.status(200).json({
            message: "Kode OTP telah dikirim ke email Anda saat ini.",
            challengeToken
        });

    } catch (err) {
        console.error("[OTP Controller Error - Change Email Request]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim OTP." });
    }
};

export const confirmChangeEmail = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { otpCode, challengeToken } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!otpCode || !challengeToken) {
            return res.status(400).json({ message: "Kode OTP dan challenge token wajib diisi." });
        }

        const tokenResult = verifyChallengeToken(challengeToken, 'change_email', userId);
        if (!tokenResult.valid) {
            return res.status(403).json({ message: tokenResult.message });
        }

        const [otpRows] = await db.query(
            'SELECT id, target_value FROM otp_verifications WHERE user_id = ? AND otp_code = ? AND action_type = ? AND expires_at > NOW()',
            [userId, otpCode, 'change_email']
        );

        if (otpRows.length === 0) {
            return res.status(400).json({ message: "Kode OTP tidak valid atau sudah kedaluwarsa." });
        }

        const newEmail = otpRows[0].target_value;

        const [existingEmail] = await db.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [newEmail, userId]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: "Email sudah digunakan oleh akun lain." });
        }

        await db.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId]);

        await db.query(
            'DELETE FROM otp_verifications WHERE user_id = ? AND action_type = ?',
            [userId, 'change_email']
        );

        res.status(200).json({
            message: "Email berhasil diubah.",
            data: { email: newEmail }
        });

    } catch (err) {
        console.error("[OTP Controller Error - Change Email Confirm]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengubah email." });
    }
};

export const requestDeleteAccountOTP = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { password } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!password) {
            return res.status(400).json({ message: "Password wajib diisi untuk konfirmasi." });
        }

        const [passwordRows] = await db.query(
            'SELECT hashed_password FROM user_passwords WHERE user_id = ?',
            [userId]
        );

        if (passwordRows.length === 0) {
            return res.status(404).json({ message: "Data password tidak ditemukan. Akun ini mungkin terdaftar via Google." });
        }

        const isMatch = await bcrypt.compare(password, passwordRows[0].hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah." });
        }

        const [userRows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        await db.query(
            'DELETE FROM otp_verifications WHERE user_id = ? AND action_type = ?',
            [userId, 'delete_account']
        );

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query(
            'INSERT INTO otp_verifications (user_id, otp_code, action_type, expires_at) VALUES (?, ?, ?, ?)',
            [userId, otpCode, 'delete_account', expiresAt]
        );

        await sendOTPViaEmailService(userRows[0].email, otpCode, 'delete_account');

        const challengeToken = signChallengeToken(userId, 'delete_account');

        res.status(200).json({
            message: "Kode OTP telah dikirim ke email Anda.",
            challengeToken
        });

    } catch (err) {
        console.error("[OTP Controller Error - Delete Account Request]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim OTP." });
    }
};

export const confirmDeleteAccount = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { otpCode, challengeToken } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Akses ditolak. Identitas tidak ditemukan dari Gateway."
            });
        }

        if (!otpCode || !challengeToken) {
            return res.status(400).json({ message: "Kode OTP dan challenge token wajib diisi." });
        }

        const tokenResult = verifyChallengeToken(challengeToken, 'delete_account', userId);
        if (!tokenResult.valid) {
            return res.status(403).json({ message: tokenResult.message });
        }

        const [otpRows] = await db.query(
            'SELECT id FROM otp_verifications WHERE user_id = ? AND otp_code = ? AND action_type = ? AND expires_at > NOW()',
            [userId, otpCode, 'delete_account']
        );

        if (otpRows.length === 0) {
            return res.status(400).json({ message: "Kode OTP tidak valid atau sudah kedaluwarsa." });
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.status(200).json({ message: "Akun berhasil dihapus secara permanen." });

    } catch (err) {
        console.error("[OTP Controller Error - Delete Account Confirm]:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus akun." });
    }
};
