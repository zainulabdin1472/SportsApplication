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

vi.mock("../src/modules/listings/listings.service.js", () => ({
  listListings: mockedList,
  createListing: mockedCreate
}));

const { buildApp } = await import("../src/app.js");

describe("Listings API", () => {
  beforeEach(() => {
    mockedList.mockReset();
    mockedCreate.mockReset();
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
