import { sendOTPEmail } from '../utils/emailSender.mjs';

export const sendOTP = async (req, res) => {
    try {
        const { to, otpCode, actionType } = req.body;

        if (!to || !otpCode || !actionType) {
            return res.status(400).json({
                message: "Field 'to', 'otpCode', dan 'actionType' wajib diisi."
            });
        }

        await sendOTPEmail(to, otpCode, actionType);

        res.status(200).json({ message: "Email OTP berhasil dikirim." });

    } catch (err) {
        console.error("[Email Service Error]:", err);
        res.status(500).json({ message: "Gagal mengirim email OTP." });
    }
}
