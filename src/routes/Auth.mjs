import { Router } from "express";
import passport from "passport";

const router = Router()

const authenticateAsync = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err) return reject(err);
            resolve({ user, info });
        })(req, res, next);
    });
};

router.post("/login", async (req, res, next) => {
    try {
        const { user, info } = await authenticateAsync(req, res, next);

        if (!user) {
            return res.status(401).json({
                message: "Login Gagal",
                error: info
            });
        }

        res.status(200).json({
            message: "Login Berhasil",
            user: user
        });

    } catch (err) {
        return res.status(500).json({
            message: "Login Gagal",
            error: err
        });
    }
})

export default router