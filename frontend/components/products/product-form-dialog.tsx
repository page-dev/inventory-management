"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductMutations } from "@/hooks/use-products";
import type { Product, ProductStatus } from "@/types/product";
import { productStatusLabels } from "@/utils/product";

interface ProductFormDialogProps {
  product?: Product;
  onClose: () => void;
  onSaved: (product: Product) => void;
}

interface FormValues {
  name: string;
  description: string;
  quantity: string;
  price: string;
  status: ProductStatus;
}

function FieldError({ field, errors }: { field: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`product-${field}-error`} className="text-sm text-destructive">
      {errors.join(" ")}
    </p>
  );
}

export function ProductFormDialog({
  product,
  onClose,
  onSaved,
}: ProductFormDialogProps) {
  const [values, setValues] = useState<FormValues>(() => ({
    name: product?.name ?? "",
    description: product?.description ?? "",
    quantity: String(product?.quantity ?? 0),
    price: product?.price ?? "0.00",
    status: product?.status ?? "active",
  }));
  const { save, isSubmitting, error, fieldErrors } = useProductMutations();
  const isEditing = product !== undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const saved = await save(
      {
        name: values.name,
        description: values.description.trim() === "" ? null : values.description,
        quantity: Number(values.quantity),
        price: values.price,
        status: values.status,
      },
      product?.id,
    );

    if (saved) onSaved(saved);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details below."
              : "Enter the details for your new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting}>
          {error && (
            <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <fieldset disabled={isSubmitting} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                name="name"
                required
                value={values.name}
                onChange={(event) => setValues({ ...values, name: event.target.value })}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "product-name-error" : undefined}
              />
              <FieldError field="name" errors={fieldErrors.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="product-description"
                name="description"
                className="min-h-24"
                value={values.description}
                onChange={(event) => setValues({ ...values, description: event.target.value })}
                aria-invalid={Boolean(fieldErrors.description)}
                aria-describedby={fieldErrors.description ? "product-description-error" : undefined}
              />
              <FieldError field="description" errors={fieldErrors.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-quantity">Quantity</Label>
                <Input
                  id="product-quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={values.quantity}
                  onChange={(event) => setValues({ ...values, quantity: event.target.value })}
                  aria-invalid={Boolean(fieldErrors.quantity)}
                  aria-describedby={fieldErrors.quantity ? "product-quantity-error" : undefined}
                />
                <FieldError field="quantity" errors={fieldErrors.quantity} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-price">Price</Label>
                <Input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={values.price}
                  onChange={(event) => setValues({ ...values, price: event.target.value })}
                  aria-invalid={Boolean(fieldErrors.price)}
                  aria-describedby={fieldErrors.price ? "product-price-error" : undefined}
                />
                <FieldError field="price" errors={fieldErrors.price} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-status">Status</Label>
              <Select
                value={values.status}
                items={productStatusLabels}
                name="status"
                disabled={isSubmitting}
                onValueChange={(status) => {
                  if (status) setValues({ ...values, status });
                }}
              >
                <SelectTrigger
                  id="product-status"
                  className="w-full"
                  aria-invalid={Boolean(fieldErrors.status)}
                  aria-describedby={fieldErrors.status ? "product-status-error" : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FieldError field="status" errors={fieldErrors.status} />
            </div>
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? (isEditing ? "Saving…" : "Adding…")
                : (isEditing ? "Save changes" : "Add product")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
