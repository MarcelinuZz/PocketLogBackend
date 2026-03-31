import mysql from "mysql";

// Isi DbConfig dengan Configurasi anda

const dbConfig = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "PocketLog"
});

dbConfig.connect((err) => {
    if (err) {
        console.error("Terjadi error saat koneksi ke database:", err.message);
        return;
    }
    console.log("Berhasil terkoneksi ke database!");
});

export default dbConfig;