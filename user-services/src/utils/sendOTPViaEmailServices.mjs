const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:3003";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

export default async function sendOTPViaEmailService(toEmail, otpCode, actionType) {
    const response = await fetch(`${EMAIL_SERVICE_URL}/email/send-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Internal-Key': INTERNAL_API_KEY
        },
        body: JSON.stringify({ to: toEmail, otpCode, actionType })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Email service error: ${errorData.message || response.statusText}`);
    }
}