"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";

const TABS = ["World", "Absurd", "Politics", "Sports", "Weather"] as const;
type Tab = typeof TABS[number];

type Bet = {
  id: string;            // normalized string id for client usage
  tab: Tab;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: string;     // ISO string from server
};

// ---------- utils ----------
function clamp01(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function normalizeId(v: unknown): string {
  if (typeof v === "string") return v;
  if (isRecord(v) && typeof v.$oid === "string") return v.$oid;
  return String(v ?? "");
}
function toNumber(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}
function parseBet(input: unknown): Bet | null {
  if (!isRecord(input)) return null;
  const tab = input.tab;
  const prompt = typeof input.prompt === "string" ? input.prompt.trim() : "";
  const yesPct = clamp01(toNumber(input.yesPct) ?? 50);
  const noPct = clamp01(toNumber(input.noPct) ?? 50);
  const createdAt =
    typeof input.createdAt === "string" ? input.createdAt : new Date().toISOString();
  const id = normalizeId(input._id);
  if (!TABS.includes(tab as Tab) || !prompt || !id) return null;
  return { id, tab: tab as Tab, prompt, yesPct, noPct, createdAt };
}
// --------------------------------

export default function AdminPage() {
  const [category, setCategory] = useState<Tab>("World");
  const [prompt, setPrompt] = useState("");
  const [yesPct, setYesPct] = useState<number>(50);
  const [noPct, setNoPct] = useState<number>(50);

  const [bets, setBets] = useState<Bet[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Load bets for the selected tab
  async function loadFor(tab: Tab) {
    try {
      const res = await fetch(`/api/bets?tab=${encodeURIComponent(tab)}`, { cache: "no-store" });
      const data: unknown = await res.json();
      const items = isRecord(data) && Array.isArray(data.items) ? data.items : [];
      const parsed = items.map(parseBet).filter((b): b is Bet => b !== null);
      setBets(parsed);
    } catch {
      setBets([]);
    }
  }

  // Initial + on tab change
  useEffect(() => {
    loadFor(category);
  }, [category]);

  // Derived list (already sorted by API, but sort again just in case)
  const list = useMemo<Bet[]>(() => {
    return bets.slice().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bets]);

  // Linked inputs (Yes + No = 100)
  const handleYes = (v: number) => {
    const y = clamp01(v);
    setYesPct(y);
    setNoPct(100 - y);
  };
  const handleNo = (v: number) => {
    const n = clamp01(v);
    setNoPct(n);
    setYesPct(100 - n);
  };

  const valid = prompt.trim().length > 0 && yesPct + noPct === 100;

  async function addBet(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tab: category,
          prompt: prompt.trim(),
          yesPct: clamp01(yesPct),
          noPct: clamp01(noPct),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Failed to add bet");
      }
      setPrompt("");
      setYesPct(50);
      setNoPct(50);
      setMsg("Added!");
      await loadFor(category);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(null), 1500);
    }
  }

  async function deleteBet(id: string) {
    if (!confirm("Delete this bet?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/bets/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Failed to delete bet");
      }
      setMsg("Deleted.");
      await loadFor(category);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(null), 1200);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Bets</h1>
        <Link href="/" className="text-sm underline">
          ← Back to site
        </Link>
      </div>

      {/* Editor */}
      <form onSubmit={addBet} className="space-y-4 rounded-xl border border-neutral-800 p-4 bg-neutral-950">
        <label className="block text-sm font-medium">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Tab)}
            className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
          >
            {TABS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Prompt
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Will X happen by DATE?"
            className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Yes %
            <input
              type="number"
              value={yesPct}
              onChange={(e) => handleYes(Number(e.target.value))}
              min={0}
              max={100}
              className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
            />
          </label>
          <label className="block text-sm font-medium">
            No %
            <input
              type="number"
              value={noPct}
              onChange={(e) => handleNo(Number(e.target.value))}
              min={0}
              max={100}
              className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
            />
          </label>
        </div>

        <p className="text-xs text-neutral-400">Yes + No must equal 100.</p>

        <button
          type="submit"
          disabled={!valid || busy}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-300 px-4 py-2 text-sm font-medium text-black hover:bg-indigo-200 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add bet to {category}
        </button>
        {msg && <span className="ml-2 text-indigo-300 text-sm">{msg}</span>}
      </form>

      {/* List for current tab */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-300">
          Existing bets in {category} ({list.length})
        </h2>

        {list.length === 0 && <p className="text-sm text-neutral-400">No bets saved yet.</p>}

        <ul className="space-y-2">
          {list.map((b) => (
            <li key={b.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{b.prompt}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Yes {b.yesPct}% • No {b.noPct}% • {new Date(b.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteBet(b.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Delete bet"
                  title="Delete bet"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
