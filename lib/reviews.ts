import { promises as fs } from "fs";
import path from "path";

export interface Review {
  id: string;
  author: string;
  text: string;
  date?: string;
}

export async function getReviews(): Promise<Review[]> {
  const p = path.join(process.cwd(), "data", "reviews.json");
  try {
    const raw = await fs.readFile(p, "utf-8");
    const data = JSON.parse(raw) as { reviews: Review[] };
    return data.reviews ?? [];
  } catch {
    return [];
  }
}
