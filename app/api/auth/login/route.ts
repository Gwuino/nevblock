import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/auth";

const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: "username and password are required" },
        { status: 400 }
      );
    }
    if (username !== ADMIN_USER) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const isDev = process.env.NODE_ENV === "development";
    if (!ADMIN_PASSWORD_HASH && !isDev) {
      return NextResponse.json(
        { error: "Server not configured: set ADMIN_PASSWORD_HASH in .env" },
        { status: 500 }
      );
    }
    let valid = false;
    if (ADMIN_PASSWORD_HASH) {
      valid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
    } else if (isDev && password === "admin") {
      valid = true; // dev fallback: password "admin"
    }
    if (!valid)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    await createSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
