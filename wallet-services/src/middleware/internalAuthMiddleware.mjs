const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

export const internalAuth = (req, res, next) => {
    const key = req.headers['x-internal-key'];
    if (!key || key !== INTERNAL_API_KEY) {
        return res.status(403).json({ message: "Akses ditolak. Internal key tidak valid." });
    }
    next();
};
