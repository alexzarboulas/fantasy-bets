import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const TABS = ["World", "Absurd", "Politics", "Sports", "Weather"] as const;
type Tab = typeof TABS[number];

type BetDoc = {
  _id?: any;
  tab: Tab;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: Date;
  authorId?: string | null;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") as Tab | null;

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<BetDoc>("bets");

  // Ensure useful indexes (safe to call repeatedly)
  await col.createIndex({ tab: 1, createdAt: -1 });

  const query: Partial<BetDoc> = {};
  if (tab && (TABS as readonly string[]).includes(tab)) query.tab = tab as Tab;

  const items = await col
    .find(query)
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<BetDoc>("bets");

  const body = await req.json().catch(() => ({}));
  const tab = body?.tab as Tab;
  const prompt = String(body?.prompt ?? "").trim();
  const yesPct = Number(body?.yesPct);
  const noPct = Number(body?.noPct);

  if (!(TABS as readonly string[]).includes(tab)) {
    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  }
  if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  if (!Number.isFinite(yesPct) || !Number.isFinite(noPct) || yesPct < 0 || noPct < 0 || yesPct + noPct !== 100) {
    return NextResponse.json({ error: "yesPct + noPct must equal 100" }, { status: 400 });
  }

  const doc: BetDoc = {
    tab,
    prompt,
    yesPct,
    noPct,
    createdAt: new Date(),
    authorId: (session as any).userId ?? null,
  };

  const { insertedId } = await col.insertOne(doc);
  return NextResponse.json({ ok: true, id: String(insertedId) });
}
