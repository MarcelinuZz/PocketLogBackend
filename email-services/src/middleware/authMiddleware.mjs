const validationInternalKey = (req, res, next) => {
    const internalKey = req.headers['x-internal-key'];

    if (!internalKey || internalKey !== (process.env.INTERNAL_API_KEY || "pocketlog_internal_s3cr3t_k3y_2026")) {
        return res.status(403).json({
            message: "Akses ditolak. Internal API key tidak valid."
        });
    }

    next();
}

export default validationInternalKey;