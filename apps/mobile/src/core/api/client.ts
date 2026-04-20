import Constants from "expo-constants";
import { z } from "zod";
import type { z as zTypes } from "zod";
import {
  createListingBodySchema,
  healthEnvelopeSchema,
  listingEnvelopeSchema,
  listingsEnvelopeSchema,
  listingSummarySchema,
  type ListingDetail,
  type ListingSummary
} from "./schemas";

const fromEnv = process.env.EXPO_PUBLIC_API_URL;
const fromExpoExtra =
  typeof Constants.expoConfig?.extra?.apiUrl === "string" ? Constants.expoConfig.extra.apiUrl : undefined;
const API_URL = (fromEnv || fromExpoExtra || "http://localhost:4000/api/v1").replace(/\/$/, "");

export type ListingFilters = {
  search?: string;
  city?: string;
  condition?: "new" | "like_new" | "used";
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
};

export class ApiError extends Error {
  statusCode: number;
  body: unknown;

  constructor(message: string, statusCode: number, body: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
  }
}

async function requestJson<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    sellerId?: string | null;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.sellerId) {
    headers["x-user-id"] = options.sellerId;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? "Request failed")
        : "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function buildListingsQuery(filters: ListingFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  if (filters.offset !== undefined) params.set("offset", String(filters.offset));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function fetchListings(
  filters: ListingFilters,
  sellerId?: string | null
): Promise<ListingSummary[]> {
  const query = buildListingsQuery(filters);
  const raw = await requestJson<unknown>(`/listings${query}`, { sellerId });
  return listingsEnvelopeSchema.parse(raw).data;
}

export async function fetchListing(id: string, sellerId?: string | null): Promise<ListingDetail> {
  const raw = await requestJson<unknown>(`/listings/${id}`, { sellerId });
  return listingEnvelopeSchema.parse(raw).data;
}

export async function createListing(
  input: zTypes.infer<typeof createListingBodySchema>,
  sellerId: string
): Promise<ListingSummary> {
  const body = createListingBodySchema.parse(input);
  const raw = await requestJson<unknown>("/listings", {
    method: "POST",
    body,
    sellerId
  });
  return z.object({ data: listingSummarySchema }).parse(raw).data;
}

export async function fetchHealth(): Promise<zTypes.infer<typeof healthEnvelopeSchema>> {
  const raw = await requestJson<unknown>("/health");
  return healthEnvelopeSchema.parse(raw);
}
