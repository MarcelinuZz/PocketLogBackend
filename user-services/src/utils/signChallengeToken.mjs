import jwt from 'jsonwebtoken';

const OTP_CHALLENGE_SECRET = process.env.OTP_CHALLENGE_SECRET;

export default function signChallengeToken(userId, actionType) {
    return jwt.sign(
        { sub: userId, action: actionType },
        OTP_CHALLENGE_SECRET,
        { expiresIn: '5m' }
    );
}
