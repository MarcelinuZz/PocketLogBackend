const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || "http://localhost:3005";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

const internalHeaders = {
    'Content-Type': 'application/json',
    'X-Internal-Key': INTERNAL_API_KEY
};


export async function getCategoryById(categoryId) {
    if (!categoryId) return null;
    try {
        const response = await fetch(`${CATEGORY_SERVICE_URL}/categories/internal/${categoryId}`, {
            headers: internalHeaders
        });
        if (!response.ok) return null;
        const { data } = await response.json();
        return data;
    } catch {
        return null;
    }
}


export async function getCategoriesByIds(categoryIds) {
    const uniqueIds = [...new Set(categoryIds.filter(Boolean))];
    const results = await Promise.all(uniqueIds.map(id => getCategoryById(id)));
    const map = new Map();
    uniqueIds.forEach((id, i) => {
        if (results[i]) map.set(id, results[i]);
    });
    return map;
}
