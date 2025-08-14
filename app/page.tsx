'use client';
import { useState } from 'react';

const TABS = ['World', 'Absurd', 'Politics', 'Sports', 'Weather'];

export default function Home() {
  const [active, setActive] = useState('World');

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Make outrageous predictions.<br className="hidden sm:block" />
          <span className="text-indigo-300"> See if the odds agree.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-white/70">
          Let the model do the bookmaking. You do the guessing.
        </p>
      </section>

      {/* Big black square with tabs */}
      <section className="mx-auto w-[min(90vw,42rem)]">
        <div className="aspect-square bg-[#000] text-white rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          {/* Tab strip: full-width, equal columns, rectangular */}
          <div
            role="tablist"
            aria-label="Prediction categories"
            className="grid grid-cols-5 h-12 rounded-t-2xl overflow-hidden"
          >
            {TABS.map((tab) => {
              const id = tab.toLowerCase();
              const isActive = active === tab;
              return (
                <button
                  key={tab}
                  id={`tab-${id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActive(tab)}
                  className={[
                    'w-full h-full flex items-center justify-center',
                    'text-xs sm:text-sm font-medium',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40',
                    isActive
                      ? 'border-b-2 border-indigo-500 text-white'
                      : 'border-b-2 border-transparent text-white/70 hover:text-white hover:bg-white/5'
                  ].join(' ')}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-6">
            <div
              id="panel-world"
              role="tabpanel"
              aria-labelledby="tab-world"
              hidden={active !== 'World'}
            >
              <p className="text-white/70">World content coming soon.</p>
            </div>
            <div
              id="panel-absurd"
              role="tabpanel"
              aria-labelledby="tab-absurd"
              hidden={active !== 'Absurd'}
            >
              <p className="text-white/70">Absurd bets go here.</p>
            </div>
            <div
              id="panel-politics"
              role="tabpanel"
              aria-labelledby="tab-politics"
              hidden={active !== 'Politics'}
            >
              <p className="text-white/70">Politics predictions coming soon.</p>
            </div>
            <div
              id="panel-sports"
              role="tabpanel"
              aria-labelledby="tab-sports"
              hidden={active !== 'Sports'}
            >
              <p className="text-white/70">Sports lines and props here.</p>
            </div>
            <div
              id="panel-weather"
              role="tabpanel"
              aria-labelledby="tab-weather"
              hidden={active !== 'Weather'}
            >
              <p className="text-white/70">Weather wagers coming soon.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
