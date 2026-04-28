import jwt from 'jsonwebtoken';

const OTP_CHALLENGE_SECRET = process.env.OTP_CHALLENGE_SECRET || "pocketlog_otp_challenge_jwt_s3cr3t_2026";

export default function signChallengeToken(email, action_type) {
    return jwt.sign(
        {
            sub: email,
            action: action_type
        },
        OTP_CHALLENGE_SECRET,
        {
            expiresIn: "5m"
        }
    )
}