import mysql from "mysql2/promise";

const dbConfig = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "PocketLog",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
});

try {
    const connection = await dbConfig.getConnection();
    console.log("Berhasil terkoneksi ke database!");
    connection.release();
} catch (err) {
    console.error("Terjadi error saat koneksi ke database:", err.message);
}

export default dbConfig;
