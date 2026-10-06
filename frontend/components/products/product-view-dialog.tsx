"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProduct } from "@/hooks/use-products";
import { formatPrice, productStatusLabels } from "@/utils/product";

export function ProductViewDialog({ id, onClose }: { id: number; onClose: () => void }) {
  const { product, isLoading, error, retry } = useProduct(id);

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Product details</DialogTitle>
          <DialogDescription>View the current details for this product.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p role="status" className="py-8 text-center text-sm text-muted-foreground">Loading product…</p>
        ) : error ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={retry}>Try again</Button>
          </div>
        ) : product && (
          <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-4 py-2 text-sm">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="break-words font-medium">{product.name}</dd>
            <dt className="text-muted-foreground">Description</dt>
            <dd className="whitespace-pre-wrap break-words">{product.description || "—"}</dd>
            <dt className="text-muted-foreground">Quantity</dt>
            <dd className="tabular-nums">{product.quantity}</dd>
            <dt className="text-muted-foreground">Price</dt>
            <dd className="tabular-nums">{formatPrice(product.price)}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                {productStatusLabels[product.status]}
              </Badge>
            </dd>
          </dl>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
