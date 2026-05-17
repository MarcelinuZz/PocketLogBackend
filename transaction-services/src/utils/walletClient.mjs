const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || "http://localhost:3004";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

const internalHeaders = {
    'Content-Type': 'application/json',
    'X-Internal-Key': INTERNAL_API_KEY
};


export async function getWalletById(walletId) {
    if (!walletId) return null;
    try {
        const response = await fetch(`${WALLET_SERVICE_URL}/wallets/internal/${walletId}`, {
            headers: internalHeaders
        });
        if (!response.ok) return null;
        const { data } = await response.json();
        return data;
    } catch {
        return null;
    }
}


export async function adjustWalletBalance(walletId, amount, operation) {
    const response = await fetch(`${WALLET_SERVICE_URL}/wallets/internal/adjust-balance`, {
        method: 'POST',
        headers: internalHeaders,
        body: JSON.stringify({ walletId, amount, operation })
    });
    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Gagal ${operation === 'add' ? 'menambah' : 'mengurangi'} saldo wallet: ${errBody}`);
    }
    return true;
}
