import { Router } from "express";
import passport from "passport";

const router = Router()

router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                message: "Login Gagal",
                error: err
            })
        }

        if (!user) {
            return res.status(401).json({
                message: "Login Gagal",
                error: info
            })
        }

        res.status(200).json({
            message: "Login Berhasil",
            user: user
        });
    })(req, res, next);
})

export default router