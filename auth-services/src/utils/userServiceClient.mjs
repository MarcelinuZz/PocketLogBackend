const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

const internalHeaders = {
    'Content-Type': 'application/json',
    'X-Internal-Key': INTERNAL_API_KEY
};

export async function initUserSettings(userId) {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/users/internal/init-settings/${userId}`, {
            method: 'POST',
            headers: internalHeaders
        });
        if (!response.ok) {
            const body = await response.text();
            console.error(`[UserServiceClient] Gagal init settings untuk user ${userId}: ${body}`);
        }
    } catch (err) {
        console.error(`[UserServiceClient] Error menghubungi user-service untuk init settings:`, err.message);
    }
}
