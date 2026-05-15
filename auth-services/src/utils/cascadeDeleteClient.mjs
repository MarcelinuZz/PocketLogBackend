const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:3004";
const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || "http://localhost:3005";
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || "http://localhost:3006";
const REMINDER_SERVICE_URL = process.env.REMINDER_SERVICE_URL || "http://localhost:3007";

const internalHeaders = {
    'Content-Type': 'application/json',
    'X-Internal-Key': INTERNAL_API_KEY
};

async function deleteFromService(serviceUrl, path, userId) {
    try {
        const response = await fetch(`${serviceUrl}${path}/${userId}`, {
            method: 'DELETE',
            headers: internalHeaders
        });
        if (!response.ok) {
            const body = await response.text();
            console.error(`[CascadeDelete] Gagal hapus di ${serviceUrl}${path}: ${body}`);
        }
    } catch (err) {
        console.error(`[CascadeDelete] Error menghubungi ${serviceUrl}${path}:`, err.message);
    }
}

export async function cascadeDeleteUserData(userId) {
    console.log(`[CascadeDelete] Memulai cascade delete untuk user ${userId}...`);
    
    await Promise.allSettled([
        deleteFromService(USER_SERVICE_URL, '/users/internal/by-user', userId),
        deleteFromService(WALLET_SERVICE_URL, '/wallets/internal/by-user', userId),
        deleteFromService(CATEGORY_SERVICE_URL, '/categories/internal/by-user', userId),
        deleteFromService(TRANSACTION_SERVICE_URL, '/transactions/internal/by-user', userId),
        deleteFromService(REMINDER_SERVICE_URL, '/reminders/internal/by-user', userId),
    ]).then(results => {
        results.forEach((result, i) => {
            if (result.status === 'rejected') {
                console.error(`[CascadeDelete] Service ${i} gagal:`, result.reason);
            }
        });
    });

    console.log(`[CascadeDelete] Cascade delete selesai untuk user ${userId}.`);
}
