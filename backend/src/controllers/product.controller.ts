import { Request, Response } from "express";
import Product from "../models/product.model";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function createProduct(req: Request, res: Response) {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const product = await Product.create({ ...req.body, createdBy: userId });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error });
  }
}

export async function getProducts(req: Request, res: Response) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const userId = (req as AuthRequest).user?.userId;
  if (product.createdBy?.toString() !== userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const userId = (req as AuthRequest).user?.userId;
  if (product.createdBy?.toString() !== userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  await Product.findByIdAndDelete(id);
  res.status(204).send();
}