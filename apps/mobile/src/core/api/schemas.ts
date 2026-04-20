import { z } from "zod";

const conditionSchema = z.enum(["new", "like_new", "used"]);

const priceField = z.union([z.number(), z.string()]).transform((value) => {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) {
    throw new Error("Invalid price");
  }
  return numeric;
});

export const listingSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  price: priceField,
  condition: conditionSchema,
  city: z.string(),
  sport_tag: z.string(),
  created_at: z.string()
});

export const listingDetailSchema = listingSummarySchema.extend({
  description: z.string(),
  seller_id: z.string().uuid(),
  status: z.string()
});

export const listingsEnvelopeSchema = z.object({
  data: z.array(listingSummarySchema)
});

export const listingEnvelopeSchema = z.object({
  data: listingDetailSchema
});

export const healthEnvelopeSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string()
});

export const createListingBodySchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(3000),
  price: z.number().positive().max(100000),
  condition: conditionSchema,
  city: z.string().min(2).max(80),
  sportTag: z.string().min(2).max(60)
});

export type ListingSummary = z.infer<typeof listingSummarySchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;
