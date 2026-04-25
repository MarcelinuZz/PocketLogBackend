const validationInternalKey = (req, res, next) => {
    const internalKey = req.headers['x-internal-key'];

    if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({
            message: "Akses ditolak. Internal API key tidak valid."
        });
    }

    next();
}

export default validationInternalKey;