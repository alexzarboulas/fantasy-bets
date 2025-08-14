'use client';
import { useState } from 'react';

const TABS = ['World', 'Absurd', 'Politics', 'Sports', 'Weather'] as const;
type Tab = typeof TABS[number];

export default function Home() {
  const [active, setActive] = useState<Tab>('World');
  const [selected, setSelected] = useState<null | 'Yes' | 'No'>(null);

  // sample odds for this bet
  const yesPct = 1;
  const noPct = 99;

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

      {/* Big black square with tabs */}
      <section className="mx-auto w-[min(90vw,42rem)]">
        <div className="aspect-square bg-black text-white rounded-2xl border border-neutral-700 shadow-lg overflow-hidden">
          {/* Tab strip */}
          <div
            role="tablist"
            aria-label="Prediction categories"
            className="grid grid-cols-5 h-12 rounded-t-2xl overflow-hidden"
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
                      : 'border-b-2 border-transparent text-gray-300 hover:text-white hover:bg-neutral-800'
                  ].join(' ')}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Content (render only the active tab) */}
          <div className="px-4 sm:px-6 py-6">
            {active === 'World' && (
              <div className="mx-auto mt-2 max-w-sm">
                {/* Floating card (solid black, no border, lift on hover) */}
                <div
                  className="rounded-xl bg-black shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {/* Title */}
                  <div className="px-4 pt-4 pb-3">
                    <h3 className="text-base font-semibold leading-tight">
                      Will Russia and Ukraine sign a peace treaty by Aug 17, 2025?
                    </h3>
                  </div>

                  {/* Divider above buttons */}
                  <div className="h-px w-full bg-neutral-800" aria-hidden />

                  {/* Yes / No segmented buttons */}
                  <div
                    role="radiogroup"
                    aria-label="Select outcome"
                    className="grid grid-cols-2"
                  >
                    {/* YES */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected === 'Yes'}
                      onClick={() => setSelected(selected === 'Yes' ? null : 'Yes')}
                      className={[
                        'h-11 px-4 flex items-center justify-between text-sm font-medium',
                        'rounded-bl-xl', // bottom-left of card
                        selected === 'Yes'
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-900 text-gray-200 hover:bg-green-600 hover:text-white',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400'
                      ].join(' ')}
                    >
                      <span>Yes</span>
                      <span className="tabular-nums">{yesPct}%</span>
                    </button>

                    {/* NO */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected === 'No'}
                      onClick={() => setSelected(selected === 'No' ? null : 'No')}
                      className={[
                        'h-11 px-4 flex items-center justify-between text-sm font-medium',
                        'rounded-br-xl', // bottom-right of card
                        selected === 'No'
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-900 text-gray-200 hover:bg-red-600 hover:text-white',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
                      ].join(' ')}
                    >
                      <span>No</span>
                      <span className="tabular-nums">{noPct}%</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {active === 'Absurd' && <p className="text-gray-300">Absurd bets go here.</p>}
            {active === 'Politics' && <p className="text-gray-300">Politics predictions coming soon.</p>}
            {active === 'Sports' && <p className="text-gray-300">Sports lines and props here.</p>}
            {active === 'Weather' && <p className="text-gray-300">Weather wagers coming soon.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
