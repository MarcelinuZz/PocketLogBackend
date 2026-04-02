import { Router } from "express";
import AuthRouter from "./Auth.mjs"

const router = Router()

router.use("/auth", AuthRouter)

export default router