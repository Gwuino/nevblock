import { promises as fs } from "fs";
import path from "path";

export interface ContactsData {
  companyName: string;
  tagline: string;
  city: string;
  address: string;
  phone: string;
  phoneRaw?: string;
  email: string;
  whatsapp?: string;
  yandexMaps?: string;
}

export async function getContacts(): Promise<ContactsData> {
  const p = path.join(process.cwd(), "data", "contacts.json");
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as ContactsData;
}
