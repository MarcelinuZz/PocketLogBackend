export default function buildTransactionQuery(extraWhere = '', limit = '') {
    return `
        SELECT 
            id, type, amount, transaction_date, title, note, receipt_image_url, created_at,
            category_id,
            from_wallet_id,
            to_wallet_id
        FROM transactions
        WHERE user_id = ? ${extraWhere}
        ORDER BY transaction_date DESC
        ${limit}
    `;
}