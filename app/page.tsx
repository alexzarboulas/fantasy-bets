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
          {/* Tabs header */}
          <div className="px-4 sm:px-6 pt-4">
            <div
              role="tablist"
              aria-label="Prediction categories"
              className="flex flex-wrap items-center gap-2"
            >
              {/* ... your tab buttons ... */}
            </div>
            <div className="mt-3 h-px w-full bg-white/10" aria-hidden />
          </div>

          {/* Tab content */}
          <div className="px-4 sm:px-6 py-6">
            {/* ... your tab panels ... */}
          </div>
        </div>
      </section>
    </div>
  );
}
