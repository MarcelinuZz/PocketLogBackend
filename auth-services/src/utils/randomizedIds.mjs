import { randomUUID } from 'node:crypto';
import db from '../config/dbConfig.mjs';

export default async function randomizedIds() {
    let id;
    let isIdUnique = false;

    while (!isIdUnique) {
        id = randomUUID();
        const [existingRows] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
        if (existingRows.length === 0) {
            isIdUnique = true;
        }
    }
    return id;
}