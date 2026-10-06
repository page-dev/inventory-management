import type { ProductStatus } from "@/types/product";

export const productStatusLabels: Record<ProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export function formatPrice(price: string): string {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
