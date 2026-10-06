import { apiRequest } from "@/lib/api/client";
import type { Product, ProductInput } from "@/types/product";

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await apiRequest<{ data: Product[] }>("/products", { signal });
  return response.data;
}

export async function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const response = await apiRequest<{ data: Product }>(`/products/${id}`, { signal });
  return response.data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const response = await apiRequest<{ data: Product }>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const response = await apiRequest<{ data: Product }>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiRequest<void>(`/products/${id}`, { method: "DELETE" });
}
