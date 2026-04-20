import { Router } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { createListingSchema, listingFilterSchema } from "./listings.schema.js";
import { createListing, getListingById, listListings } from "./listings.service.js";

export const listingsRouter = Router();

const listingIdParamSchema = z.object({
  id: z.string().uuid()
});

listingsRouter.get("/", async (req, res) => {
  const filters = listingFilterSchema.parse(req.query);
  const listings = await listListings(filters);
  res.json({ data: listings });
});

listingsRouter.get("/:id", async (req, res) => {
  const { id } = listingIdParamSchema.parse(req.params);
  const listing = await getListingById(id);
  res.json({ data: listing });
});

listingsRouter.post("/", async (req, res) => {
  if (!req.auth.userId) {
    throw createHttpError(401, "Authentication required");
  }

  const payload = createListingSchema.parse(req.body);
  const listing = await createListing(payload, req.auth.userId);
  res.status(201).json({ data: listing });
});
