import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

type Ctx = { params: { id: string } };

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

export async function PATCH(request: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let _id: ObjectId;
  try {
    _id = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const update: Partial<{ prompt: string; yesPct: number; noPct: number }> = {};
  if (typeof body.prompt === "string") update.prompt = body.prompt.trim();
  if (typeof body.yesPct === "number") update.yesPct = Math.round(body.yesPct);
  if (typeof body.noPct === "number") update.noPct = Math.round(body.noPct);

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("bets");

  const existing = await col.findOne({ _id });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session as { userId?: string }).userId;
  if (existing.authorId && userId && existing.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await col.updateOne({ _id }, { $set: update });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let _id: ObjectId;
  try {
    _id = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("bets");

  const existing = await col.findOne({ _id });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session as { userId?: string }).userId;
  if (existing.authorId && userId && existing.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await col.deleteOne({ _id });
  return NextResponse.json({ ok: true });
}
