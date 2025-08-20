"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";

const TABS = ["World", "Absurd", "Politics", "Sports", "Weather"] as const;
type Tab = typeof TABS[number];

type Bet = {
  id: string;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: number;
};

type BetsMap = Partial<Record<Tab, Bet[]>>;

const STORAGE_KEY = "fantasy-bets:bets";

// ---------- utils ----------
function clamp01(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toNumber(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function normalizeBet(input: unknown): Bet {
  const r = isRecord(input) ? input : {};

  const prompt =
    typeof r.prompt === "string" ? r.prompt.trim() : "";

  const yesRaw = toNumber(r.yesPct);
  const noRaw = toNumber(r.noPct);
  const yesPct = clamp01(yesRaw ?? 50);
  const noPct = clamp01(noRaw ?? 50);

  const createdAt =
    typeof r.createdAt === "number" && Number.isFinite(r.createdAt)
      ? r.createdAt
      : Date.now();

  const id = typeof r.id === "string" ? r.id : newId();

  return { id, prompt, yesPct, noPct, createdAt };
}

function migrate(input: unknown): BetsMap {
  const out: BetsMap = {};
  const root = isRecord(input) ? input : {};

  for (const tab of TABS) {
    const v = root[tab as keyof typeof root];

    if (Array.isArray(v)) {
      out[tab] = v.map(normalizeBet);
    } else if (isRecord(v)) {
      // old format: single object → wrap in array
      out[tab] = [normalizeBet(v)];
    }
    // else: leave undefined
  }
  return out;
}
// --------------------------------

export default function AdminPage() {
  const [category, setCategory] = useState<Tab>("World");
  const [prompt, setPrompt] = useState("");
  const [yesPct, setYesPct] = useState<number>(50);
  const [noPct, setNoPct] = useState<number>(50);
  const [data, setData] = useState<BetsMap>({});
  const [saved, setSaved] = useState<string | null>(null);

  // Load + migrate once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      const migrated = migrate(parsed);
      setData(migrated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      setData({});
    }
  }, []);

  // Derived list for current tab (newest first)
  const list = useMemo<Bet[]>(() => {
    const arr = data[category] ?? [];
    return arr.slice().sort((a, b) => b.createdAt - a.createdAt);
  }, [data, category]);

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

  const persist = (next: BetsMap) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addBet = () => {
    const trimmed = prompt.trim();
    if (!trimmed || yesPct + noPct !== 100) return;

    const bet: Bet = {
      id: newId(),
      prompt: trimmed,
      yesPct: clamp01(yesPct),
      noPct: clamp01(noPct),
      createdAt: Date.now(),
    };

    const curr = data[category] ?? [];
    const next: BetsMap = { ...data, [category]: [...curr, bet] };
    persist(next);

    setSaved(`Added to ${category}`);
    setTimeout(() => setSaved(null), 1200);

    // reset form
    setPrompt("");
    setYesPct(50);
    setNoPct(50);
  };

  const deleteBet = (id: string) => {
    if (!confirm("Delete this bet?")) return;
    const curr = data[category] ?? [];
    const nextArr = curr.filter((b) => b.id !== id);
    const next: BetsMap = { ...data, [category]: nextArr };
    persist(next);
  };

  const valid = prompt.trim().length > 0 && yesPct + noPct === 100;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Bets</h1>
        <Link href="/" className="text-sm underline">← Back to site</Link>
      </div>

      {/* Editor */}
      <div className="space-y-4 rounded-xl border border-neutral-800 p-4 bg-neutral-950">
        <label className="block text-sm font-medium">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Tab)}
            className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
          >
            {TABS.map((t) => <option key={t} value={t}>{t}</option>)}
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
              min={0} max={100}
              className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
            />
          </label>
          <label className="block text-sm font-medium">
            No %
            <input
              type="number"
              value={noPct}
              onChange={(e) => handleNo(Number(e.target.value))}
              min={0} max={100}
              className="mt-1 block w-full rounded-md bg-neutral-900 border border-neutral-700 p-2"
            />
          </label>
        </div>

        <p className="text-xs text-neutral-400">Yes + No must equal 100.</p>

        <button
          onClick={addBet}
          disabled={!valid}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add bet to {category}
        </button>
        {saved && <span className="ml-2 text-green-400 text-sm">{saved}</span>}
      </div>

      {/* List for current tab */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-300">
          Existing bets in {category} ({list.length})
        </h2>

        {list.length === 0 && (
          <p className="text-sm text-neutral-400">No bets saved yet.</p>
        )}

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
