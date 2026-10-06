import type { Metadata } from "next";
import { ProductsScreen } from "@/components/products/products-screen";

export const metadata: Metadata = {
  title: "Products | Inventory Management",
};

export default function ProductsPage() {
  return <ProductsScreen />;
}
