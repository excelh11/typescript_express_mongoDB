"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const product_model_1 = __importDefault(require("../models/product.model"));
async function createProduct(req, res) {
    try {
        const userId = req.user?.userId;
        const product = await product_model_1.default.create({ ...req.body, createdBy: userId });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create product", error });
    }
}
async function getProducts(req, res) {
    const products = await product_model_1.default.find().sort({ createdAt: -1 });
    res.json(products);
}
async function getProductById(req, res) {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product)
        return res.status(404).json({ message: "Product not found" });
    res.json(product);
}
async function updateProduct(req, res) {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product)
        return res.status(404).json({ message: "Product not found" });
    const userId = req.user?.userId;
    if (product.createdBy?.toString() !== userId) {
        return res.status(403).json({ message: "권한이 없습니다" });
    }
    const updated = await product_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
}
async function deleteProduct(req, res) {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product)
        return res.status(404).json({ message: "Product not found" });
    const userId = req.user?.userId;
    if (product.createdBy?.toString() !== userId) {
        return res.status(403).json({ message: "권한이 없습니다" });
    }
    await product_model_1.default.findByIdAndDelete(id);
    res.status(204).send();
}
