import { randomUUID } from 'node:crypto';
import db from '../config/dbConfig.mjs';

export default async function randomizedIds(tableName = 'categories') {
    let id;
    let isIdUnique = false;

    while (!isIdUnique) {
        id = randomUUID();
        const [existingRows] = await db.query(`SELECT id FROM ${tableName} WHERE id = ?`, [id]);
        if (existingRows.length === 0) {
            isIdUnique = true;
        }
    }
    return id;
}
