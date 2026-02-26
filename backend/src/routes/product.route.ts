import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller";
// 나중에 auth/Middleware 붙일 예정
import {authMiddleware} from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware); // Private Route 적용 시 사용

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;