import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("bets");

  const _id = new ObjectId(params.id);
  const body = await _.json().catch(() => ({}));

  const existing = await col.findOne({ _id });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.authorId && existing.authorId !== (session as any).userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update: any = {};
  if (typeof body.prompt === "string") update.prompt = body.prompt.trim();
  if (Number.isFinite(body.yesPct)) update.yesPct = Number(body.yesPct);
  if (Number.isFinite(body.noPct)) update.noPct = Number(body.noPct);

  await col.updateOne({ _id }, { $set: update });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("bets");

  const _id = new ObjectId(params.id);
  const existing = await col.findOne({ _id });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.authorId && existing.authorId !== (session as any).userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await col.deleteOne({ _id });
  return NextResponse.json({ ok: true });
}
