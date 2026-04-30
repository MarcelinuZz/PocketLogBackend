export default function buildTransactionQuery(extraWhere = '', limit = '') {
    return `
        SELECT 
            t.id, t.type, t.amount, t.transaction_date, t.title, t.note, t.receipt_image_url, t.created_at,
            t.category_id, c.name AS category_name, c.icon_url AS category_icon_url, c.color_hex AS category_color_hex,
            t.from_wallet_id, fw.name AS from_wallet_name, fw.color_hex AS from_wallet_color_hex,
            t.to_wallet_id, tw.name AS to_wallet_name, tw.color_hex AS to_wallet_color_hex
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN wallets fw ON t.from_wallet_id = fw.id
        LEFT JOIN wallets tw ON t.to_wallet_id = tw.id
        WHERE t.user_id = ? ${extraWhere}
        ORDER BY t.transaction_date DESC
        ${limit}
    `;
}