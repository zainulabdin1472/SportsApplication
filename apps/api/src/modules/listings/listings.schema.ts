import { z } from "zod";

export const listingConditionSchema = z.enum(["new", "like_new", "used"]);

export const createListingSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(3000),
  price: z.number().positive().max(100000),
  condition: listingConditionSchema,
  city: z.string().min(2).max(80),
  sportTag: z.string().min(2).max(60)
});

export const listingFilterSchema = z.object({
  city: z.string().optional(),
  condition: listingConditionSchema.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type ListingFilterInput = z.infer<typeof listingFilterSchema>;
