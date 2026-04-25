const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

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