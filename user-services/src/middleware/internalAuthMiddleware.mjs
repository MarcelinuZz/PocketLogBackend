const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026";

export const internalAuth = (req, res, next) => {
    const key = req.headers['x-internal-key'];
    if (!key || key !== INTERNAL_API_KEY) {
        return res.status(403).json({ message: "Akses ditolak. Internal key tidak valid." });
    }
    next();
};
