import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ObjectId } from "mongodb";

export const runtime = "nodejs";

const TABS = ["World", "Absurd", "Politics", "Sports", "Weather"] as const;
type Tab = typeof TABS[number];

interface BetDoc {
  _id?: ObjectId;
  tab: Tab;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: Date;
  authorId?: string | null;
}

interface BetOut {
  id: string;
  tab: Tab;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: string;
  authorId?: string | null;
}

function isTab(v: unknown): v is Tab {
  return typeof v === "string" && (TABS as readonly string[]).includes(v);
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tabParam = url.searchParams.get("tab");

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<BetDoc>("bets");

  await col.createIndex({ tab: 1, createdAt: -1 });

  const query: Partial<BetDoc> = {};
  if (isTab(tabParam)) query.tab = tabParam;

  const docs = await col.find(query).sort({ createdAt: -1 }).limit(200).toArray();

  const items: BetOut[] = docs.map((d) => ({
    id: d._id!.toString(),
    tab: d.tab,
    prompt: d.prompt,
    yesPct: d.yesPct,
    noPct: d.noPct,
    createdAt: d.createdAt.toISOString(),
    authorId: d.authorId ?? null,
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bodyUnknown = await req.json().catch(() => null);
  if (!isRecord(bodyUnknown)) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const tab = bodyUnknown.tab;
  const prompt = bodyUnknown.prompt;
  const yesPct = Number((bodyUnknown as Record<string, unknown>).yesPct);
  const noPct = Number((bodyUnknown as Record<string, unknown>).noPct);

  if (!isTab(tab)) return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }
  if (!Number.isFinite(yesPct) || !Number.isFinite(noPct) || yesPct < 0 || noPct < 0 || Math.round(yesPct + noPct) !== 100) {
    return NextResponse.json({ error: "yesPct + noPct must equal 100" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<BetDoc>("bets");

  const doc: BetDoc = {
    tab,
    prompt: prompt.trim(),
    yesPct: Math.round(yesPct),
    noPct: Math.round(noPct),
    createdAt: new Date(),
    authorId: (session as { userId?: string }).userId ?? null,
  };

  const { insertedId } = await col.insertOne(doc);
  return NextResponse.json({ ok: true, id: insertedId.toString() });
}
