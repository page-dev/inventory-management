"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";
import { formatPrice, productStatusLabels } from "@/utils/product";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table className="min-w-[760px]" aria-busy={isLoading}>
        <TableCaption className="sr-only">
          Products with their descriptions, quantities, prices, statuses, and actions.
        </TableCaption>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="pl-5">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="pl-5">Status</TableHead>
            <TableHead className="pr-5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-44 text-center">
                <p role="status" className="text-muted-foreground">Loading products…</p>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-44 text-center">
                <p className="font-medium">No products yet</p>
                <p className="mt-1 text-muted-foreground">Add a product to get started.</p>
              </TableCell>
            </TableRow>
          ) : products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="max-w-60 whitespace-normal break-words py-4 pl-5 font-medium">
                {product.name}
              </TableCell>
              <TableCell className="max-w-80 whitespace-normal break-words text-muted-foreground">
                {product.description || "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">{product.quantity}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPrice(product.price)}</TableCell>
              <TableCell className="pl-5">
                <Badge variant={product.status === "active" ? "default" : "secondary"}>
                  {productStatusLabels[product.status]}
                </Badge>
              </TableCell>
              <TableCell className="pr-5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(product)}
                    aria-label={`View ${product.name}`}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
