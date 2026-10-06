"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProductMutations } from "@/hooks/use-products";
import type { Product } from "@/types/product";

interface ProductDeleteDialogProps {
  product: Product;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export function ProductDeleteDialog({
  product,
  onClose,
  onDeleted,
}: ProductDeleteDialogProps) {
  const { remove, isSubmitting, error } = useProductMutations();
  const cancelRef = useRef<HTMLButtonElement>(null);

  async function handleDelete() {
    if (isSubmitting) return;
    if (await remove(product.id)) onDeleted(product.id);
  }

  return (
    <AlertDialog open onOpenChange={(open) => {
      if (!open && !isSubmitting) onClose();
    }}>
      <AlertDialogContent initialFocus={cancelRef} aria-busy={isSubmitting}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="break-words font-medium text-foreground">{product.name}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef} disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isSubmitting} onClick={handleDelete}>
            {isSubmitting ? "Deleting…" : "Delete product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
