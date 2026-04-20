const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export type Listing = {
  id: string;
  title: string;
  price: number;
  condition: "new" | "like_new" | "used";
  city: string;
};

export async function fetchListings(): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/listings`);
  if (!response.ok) {
    throw new Error("Could not fetch listings.");
  }

  const payload = (await response.json()) as { data: Listing[] };
  return payload.data;
}
