import { Router } from "express";
import createHttpError from "http-errors";
import { createListingSchema, listingFilterSchema } from "./listings.schema.js";
import { createListing, listListings } from "./listings.service.js";

export const listingsRouter = Router();

listingsRouter.get("/", async (req, res) => {
  const filters = listingFilterSchema.parse(req.query);
  const listings = await listListings(filters);
  res.json({ data: listings });
});

listingsRouter.post("/", async (req, res) => {
  if (!req.auth.userId) {
    throw createHttpError(401, "Authentication required");
  }

  const payload = createListingSchema.parse(req.body);
  const listing = await createListing(payload, req.auth.userId);
  res.status(201).json({ data: listing });
});
