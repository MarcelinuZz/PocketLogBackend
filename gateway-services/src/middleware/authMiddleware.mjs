import jwt from 'jsonwebtoken';
import db from '../config/dbConfig.mjs'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const [blacklist] = await db.query('SELECT id FROM token_blacklist WHERE token_id = ?', [token]);
        if (blacklist.length > 0) {
            return res.status(403).json({ message: "Sesi telah berakhir. Silakan login kembali." });
        }
        
        const secret = process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1";
        const decoded = jwt.verify(token, secret);

        req.headers['x-user-id'] = decoded.sub;

        next();
    } catch (err) {
        return res.status(403).json({ 
            message: "Token tidak valid atau sudah kedaluwarsa.", 
            error: err.message 
        });
    }
};