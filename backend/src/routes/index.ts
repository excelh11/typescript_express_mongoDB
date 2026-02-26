import { Router } from "express";
import productRouter from "./product.route";
import authRouter from "./auth.route";
import videoRouter from "./video.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/videos", videoRouter);

export default router;