"use client";

import { useState } from "react";
import { Package, Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDeleteDialog } from "@/components/products/product-delete-dialog";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { ProductTable } from "@/components/products/product-table";
import { ProductViewDialog } from "@/components/products/product-view-dialog";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types/product";

type ProductDialog =
  | { kind: "create" }
  | { kind: "edit"; product: Product }
  | { kind: "view"; product: Product }
  | { kind: "delete"; product: Product }
  | null;

export function ProductsScreen() {
  const {
    products,
    isLoading,
    error,
    refresh,
    upsertProduct,
    removeProduct,
  } = useProducts();
  const [dialog, setDialog] = useState<ProductDialog>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSaved(product: Product) {
    upsertProduct(product);
    setFeedback(dialog?.kind === "edit" ? "Product updated." : "Product added.");
    setDialog(null);
  }

  function handleDeleted(id: number) {
    removeProduct(id);
    setFeedback("Product deleted.");
    setDialog(null);
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package aria-hidden="true" className="size-5" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Inventory Management</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Products</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your products, quantities, and prices.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={isLoading || dialog !== null}
              onClick={() => {
                setFeedback(null);
                refresh();
              }}
            >
              <RotateCw aria-hidden="true" className={isLoading ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <Button disabled={isLoading} onClick={() => {
              setFeedback(null);
              setDialog({ kind: "create" });
            }}>
              <Plus aria-hidden="true" />
              Add Product
            </Button>
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {feedback && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {feedback}
            </p>
          )}
        </div>
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" disabled={isLoading} onClick={refresh}>
              Try again
            </Button>
          </div>
        )}
        {(!error || products.length > 0) && (
          <ProductTable
            products={products}
            isLoading={isLoading}
            onView={(product) => setDialog({ kind: "view", product })}
            onEdit={(product) => setDialog({ kind: "edit", product })}
            onDelete={(product) => setDialog({ kind: "delete", product })}
          />
        )}
        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        )}
      </main>
      {(dialog?.kind === "create" || dialog?.kind === "edit") && (
        <ProductFormDialog
          key={dialog.kind === "edit" ? dialog.product.id : "create"}
          product={dialog.kind === "edit" ? dialog.product : undefined}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === "view" && (
        <ProductViewDialog
          key={dialog.product.id}
          id={dialog.product.id}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "delete" && (
        <ProductDeleteDialog
          key={dialog.product.id}
          product={dialog.product}
          onClose={() => setDialog(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
