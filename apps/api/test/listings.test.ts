import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.PORT = "4001";
process.env.CORS_ORIGIN = "*";
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_ANON_KEY = "anon-key-placeholder";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-placeholder";

const mockedList = vi.fn();
const mockedCreate = vi.fn();
const mockedGetById = vi.fn();

vi.mock("../src/modules/listings/listings.service.js", () => ({
  listListings: mockedList,
  createListing: mockedCreate,
  getListingById: mockedGetById
}));

const { buildApp } = await import("../src/app.js");

describe("Listings API", () => {
  beforeEach(() => {
    mockedList.mockReset();
    mockedCreate.mockReset();
    mockedGetById.mockReset();
  });

  it("returns listings", async () => {
    mockedList.mockResolvedValueOnce([
      { id: "1", title: "Tennis Racket", price: 120, condition: "used", city: "Lahore" }
    ]);

    const app = buildApp();
    const response = await request(app).get("/api/v1/listings");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("returns a single listing", async () => {
    const id = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    mockedGetById.mockResolvedValueOnce({
      id,
      seller_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      title: "Pro Badminton Racket",
      description: "Lightweight carbon frame, excellent tension.",
      price: 89.99,
      condition: "like_new",
      city: "Islamabad",
      sport_tag: "badminton",
      status: "active",
      created_at: "2026-01-01T00:00:00.000Z"
    });

    const app = buildApp();
    const response = await request(app).get(`/api/v1/listings/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Pro Badminton Racket");
  });

  it("creates listing when authenticated", async () => {
    mockedCreate.mockResolvedValueOnce({
      id: "2",
      title: "Basketball Shoes",
      price: 95,
      condition: "like_new",
      city: "Karachi"
    });

    const app = buildApp();
    const response = await request(app)
      .post("/api/v1/listings")
      .set("x-user-id", "user-1")
      .send({
        title: "Basketball Shoes",
        description: "Only worn for two matches, excellent grip and condition.",
        price: 95,
        condition: "like_new",
        city: "Karachi",
        sportTag: "basketball"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe("2");
  });

  it("blocks unauthenticated listing creation", async () => {
    const app = buildApp();
    const response = await request(app).post("/api/v1/listings").send({});

    expect(response.status).toBe(401);
  });
});
