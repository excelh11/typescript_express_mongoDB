import { apiClient } from "./client";

export async function getProducts() {
  const { data } = await apiClient.get("/products");
  return data;
}

export async function getProductById(id: string) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function createProduct(body: { name: string; price: number; description?: string }) {
  const { data } = await apiClient.post("/products", body);
  return data;
}

export async function updateProduct(id: string, body: Partial<{ name: string; price: number; description?: string }>) {
  const { data } = await apiClient.put(`/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/products/${id}`);
}