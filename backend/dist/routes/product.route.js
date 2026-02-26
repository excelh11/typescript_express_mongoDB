"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
// 나중에 auth/Middleware 붙일 예정
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware); // Private Route 적용 시 사용
router.post("/", product_controller_1.createProduct);
router.get("/", product_controller_1.getProducts);
router.get("/:id", product_controller_1.getProductById);
router.put("/:id", product_controller_1.updateProduct);
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
