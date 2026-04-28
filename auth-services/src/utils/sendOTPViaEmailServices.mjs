const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:3003";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

export default async function sendOTPViaEmailService(toEmail, otpCode, actionType) {
    try {
        const response = await fetch(`${EMAIL_SERVICE_URL}/email/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Internal-Key": INTERNAL_API_KEY
            },
            body: JSON.stringify({
                to: toEmail,
                otpCode,
                actionType
            })
        })

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gagal mengirim email OTP: ${errorBody}`);
        }

    } catch (err) {
        console.error("[OTP Service Error]:", err);
        throw new Error("Gagal mengirim email OTP");
    }
}