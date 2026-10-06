export type ProductStatus = "active" | "inactive";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  price: string;
  status: ProductStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductInput {
  name: string;
  description: string | null;
  quantity: number;
  price: string;
  status: ProductStatus;
}

export type FieldErrors = Record<string, string[]>;
