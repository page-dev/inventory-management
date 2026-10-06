"use client";

import { useEffect, useState } from "react";
import { ApiError, getErrorMessage } from "@/lib/api/client";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "@/lib/api/products";
import type { FieldErrors, Product, ProductInput } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

  function refresh() {
    setError(null);
    setIsLoading(true);
    setRefreshKey((key) => key + 1);
  }

  function upsertProduct(product: Product) {
    setProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.map((item) => (item.id === product.id ? product : item));
      }
      return [...current, product];
    });
  }

  function removeProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  return { products, isLoading, error, refresh, upsertProduct, removeProduct };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getProduct(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProduct(data);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, refreshKey]);

  function retry() {
    setError(null);
    setIsLoading(true);
    setRefreshKey((key) => key + 1);
  }

  return { product, isLoading, error, retry };
}

export function useProductMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function save(input: ProductInput, id?: number): Promise<Product | null> {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      return id === undefined ? await createProduct(input) : await updateProduct(id, input);
    } catch (error) {
      setError(getErrorMessage(error));
      if (error instanceof ApiError) {
        setFieldErrors(error.errors);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function remove(id: number): Promise<boolean> {
    setIsSubmitting(true);
    setError(null);

    try {
      await deleteProduct(id);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { save, remove, isSubmitting, error, fieldErrors };
}
