'use client';

import { useEffect, useMemo, useState } from 'react';

const TABS = ['World', 'Absurd', 'Politics', 'Sports', 'Weather'] as const;
type Tab = typeof TABS[number];

type Bet = {
  id: string;
  tab: Tab;
  prompt: string;
  yesPct: number;
  noPct: number;
  createdAt: string; // ISO
};

type BetsByTab = Record<Tab, Bet[]>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object';
}
function parseItems(d: unknown): Bet[] {
  if (!isRecord(d)) return [];
  const items = (d as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const out: Bet[] = [];
  for (const it of items) {
    if (!isRecord(it)) continue;
    const id = typeof it.id === 'string' ? it.id : '';
    const tab = typeof it.tab === 'string' ? it.tab : '';
    const prompt = typeof it.prompt === 'string' ? it.prompt : '';
    const yesPct = typeof it.yesPct === 'number' ? it.yesPct : NaN;
    const noPct = typeof it.noPct === 'number' ? it.noPct : NaN;
    const createdAt = typeof it.createdAt === 'string' ? it.createdAt : '';
    if (id && prompt && createdAt && (['World','Absurd','Politics','Sports','Weather'] as string[]).includes(tab) && Number.isFinite(yesPct) && Number.isFinite(noPct)) {
      out.push({ id, tab: tab as Tab, prompt, yesPct, noPct, createdAt });
    }
  }
  return out;
}

export default function HomeClient() {
  const [active, setActive] = useState<Tab>('World');
  const [betsByTab, setBetsByTab] = useState<Partial<BetsByTab>>({});
  const [selectedById, setSelectedById] = useState<Record<string, 'Yes' | 'No' | null>>({});

  async function loadTab(tab: Tab) {
    const res = await fetch(`/api/bets?tab=${encodeURIComponent(tab)}`, { cache: 'no-store' });
    const data = await res.json();
    const list = parseItems(data);
    setBetsByTab(prev => ({ ...prev, [tab]: list }));
  }

  useEffect(() => { loadTab(active); }, [active]);

  useEffect(() => {
    const onFocus = () => loadTab(active);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [active]);

  const list = useMemo<Bet[]>(() => {
    const arr = betsByTab[active] ?? [];
    return arr.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [betsByTab, active]);

  const toggle = (id: string, val: 'Yes' | 'No') =>
    setSelectedById((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }));

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Make outrageous predictions.<br className="hidden sm:block" />
          <span className="text-indigo-300"> See if the odds agree.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-gray-300">
          Let the model do the bookmaking. You do the guessing.
        </p>
      </section>

      {/* Category panel */}
      <section className="mx-auto w-[min(90vw,42rem)]">
        <div className="bg-black text-white rounded-2xl border border-neutral-700 shadow-lg overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 bg-black text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide uppercase text-center border-b border-neutral-800 sticky top-0 z-20">
              Weekly Bet Board
            </div>

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Prediction categories"
              className="grid grid-cols-5 h-12 border-b border-neutral-800 bg-black sticky top-12 z-10"
            >
              {TABS.map((tab) => {
                const isActive = active === tab;
                return (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(tab)}
                    className={[
                      'w-full h-full flex items-center justify-center',
                      'text-xs sm:text-sm font-medium',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                      isActive
                        ? 'border-b-2 border-indigo-500 text-white'
                        : 'border-b-2 border-transparent text-gray-300 hover:text-white hover:bg-neutral-800',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-6 space-y-12 pr-1">
              {list.length === 0 && (
                <p className="text-sm text-neutral-400">
                  No bets saved for <span className="font-medium">{active}</span>.
                </p>
              )}

              {list.map((b) => {
                const sel = selectedById[b.id] ?? null;
                const yesPctClass = sel === 'Yes' ? 'text-white' : 'text-green-600';
                const noPctClass  = sel === 'No'  ? 'text-white' : 'text-red-600';

                return (
                  <div key={b.id} className="mx-auto max-w-sm">
                    <div className="rounded-xl bg-indigo-300 text-black shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-2xl">
                      <div className="px-4 pt-4 pb-3">
                        <h3 className="text-base font-semibold leading-tight">{b.prompt}</h3>
                      </div>
                      <div className="h-px w-full bg-black/20" aria-hidden />
                      <div role="radiogroup" aria-label="Select outcome" className="grid grid-cols-2">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={sel === 'Yes'}
                          onClick={() => toggle(b.id, 'Yes')}
                          className={[
                            'h-11 px-4 flex items-center justify-between text-sm font-medium',
                            'rounded-bl-xl',
                            sel === 'Yes'
                              ? 'bg-green-600 text-white'
                              : 'bg-neutral-900 text-gray-200 hover:bg-green-600 hover:text-white',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400',
                          ].join(' ')}
                        >
                          <span>Yes</span>
                          <span className={['tabular-nums', yesPctClass].join(' ')}>{b.yesPct}%</span>
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={sel === 'No'}
                          onClick={() => toggle(b.id, 'No')}
                          className={[
                            'h-11 px-4 flex items-center justify-between text-sm font-medium',
                            'rounded-br-xl',
                            sel === 'No'
                              ? 'bg-red-600 text-white'
                              : 'bg-neutral-900 text-gray-200 hover:bg-red-600 hover:text-white',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
                          ].join(' ')}
                        >
                          <span>No</span>
                          <span className={['tabular-nums', noPctClass].join(' ')}>{b.noPct}%</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
