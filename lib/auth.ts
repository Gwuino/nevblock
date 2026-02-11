import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "nevblock_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "nevblock-dev-secret-change-in-production";

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function createSession(): Promise<string> {
  const token = Buffer.from(`${SESSION_SECRET}-${Date.now()}`).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;
  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const [secret] = decoded.split("-");
    if (secret !== SESSION_SECRET) return null;
    return session.value;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
