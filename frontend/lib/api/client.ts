import type { FieldErrors } from "@/types/product";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: FieldErrors = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("The product service is unavailable. Please try again later.");
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    if (options.signal?.aborted) {
      throw error;
    }
    throw new Error("Unable to reach the product service. Please try again.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.message ?? "The request failed. Please try again.",
      body?.errors ?? {},
    );
  }

  if (body === null) {
    throw new Error("The product service returned an unreadable response. Please try again.");
  }

  return body as T;
}
