import createHttpError from "http-errors";
import { supabase } from "../../lib/supabase.js";
import type { CreateListingInput, ListingFilterInput } from "./listings.schema.js";

export async function listListings(filters: ListingFilterInput) {
  let query = supabase
    .from("listings")
    .select("id,title,price,condition,city,sport_tag,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(filters.offset, filters.offset + filters.limit - 1);

  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters.search) query = query.textSearch("search_vector", filters.search);

  const { data, error } = await query;
  if (error) throw createHttpError(500, error.message);

  return data ?? [];
}

export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("id,seller_id,title,description,price,condition,city,sport_tag,status,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw createHttpError(500, error.message);
  if (!data) throw createHttpError(404, "Listing not found");
  if (data.status !== "active") throw createHttpError(404, "Listing not found");

  return data;
}

export async function createListing(input: CreateListingInput, sellerId: string) {
  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: sellerId,
      title: input.title,
      description: input.description,
      price: input.price,
      condition: input.condition,
      city: input.city,
      sport_tag: input.sportTag,
      status: "active"
    })
    .select("id,title,price,condition,city,sport_tag,created_at")
    .single();

  if (error) throw createHttpError(500, error.message);
  return data;
}
