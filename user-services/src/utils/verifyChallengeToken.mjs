import jwt from 'jsonwebtoken';

const OTP_CHALLENGE_SECRET = process.env.OTP_CHALLENGE_SECRET || "pocketlog_otp_challenge_jwt_s3cr3t_2026";

export default function verifyChallengeToken(challengeToken, expectedAction, expectedUserId) {
    try {
        const decoded = jwt.verify(challengeToken, OTP_CHALLENGE_SECRET);

        if (decoded.action !== expectedAction) {
            return { valid: false, message: "Challenge token tidak sesuai dengan aksi yang diminta." };
        }

        if (String(decoded.sub) !== String(expectedUserId)) {
            return { valid: false, message: "Challenge token tidak sesuai dengan user ini." };
        }

        return { valid: true, decoded };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { valid: false, message: "Challenge token sudah kedaluwarsa. Silakan request OTP ulang." };
        }
        return { valid: false, message: "Challenge token tidak valid." };
    }
}