import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export const runtime = "nodejs";

const DB_NAME =
  process.env.MONGODB_URI?.match(/mongodb.*\/([^/?]+)(\?|$)/)?.[1] || "fantasybets";
const USERS = "users";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

function normalizeEmail(raw: unknown) {
  if (typeof raw !== "string") return null;
  const e = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

export async function POST(req: Request) {
  try {
    const { email: rawEmail, password, name } = (await req.json()) as RegisterBody;
    const email = normalizeEmail(rawEmail);
    if (!email || !password) {
      return NextResponse.json({ error: "Invalid email or missing password" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Ensure case-insensitive uniqueness by storing lowercase + unique index
    await db.collection(USERS).createIndex({ email: 1 }, { unique: true });

    const existing = await db.collection(USERS).findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashed = await hash(password, 10);
    const result = await db.collection(USERS).insertOne({
      email,
      password: hashed,
      name: name ?? null,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, id: String(result.insertedId) });
  } catch (err: unknown) {
    // Duplicate key error
    const code = (err as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    console.error("REGISTER ERROR:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
