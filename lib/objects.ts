import { promises as fs } from "fs";
import path from "path";

export interface SiteObject {
  id: string;
  title: string;
  description: string;
}

export async function getObjects(): Promise<SiteObject[]> {
  const p = path.join(process.cwd(), "data", "objects.json");
  try {
    const raw = await fs.readFile(p, "utf-8");
    const data = JSON.parse(raw) as { objects: SiteObject[] };
    return data.objects ?? [];
  } catch {
    return [];
  }
}
