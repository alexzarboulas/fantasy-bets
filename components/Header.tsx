"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950 h-16">
      <div className="mx-auto max-w-6xl container-px flex h-full items-center justify-between">
        {/* Left: Menu */}
        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* Center: Title */}
        <h1 className="text-lg font-semibold tracking-tight">
          Fantasy Bets
        </h1>

        {/* Right: Profile + Settings */}
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            aria-label="Account"
          >
            👤
          </Link>
          <Link
            href="/settings"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            aria-label="Settings"
          >
            ⚙️
          </Link>
        </div>
      </div>

      {/* Optional mobile drawer */}
      {open && (
        <nav className="border-t border-white/10 bg-neutral-950">
          <ul className="container-px mx-auto py-2 space-y-1">
            <li>
              <Link
                className="block rounded-lg px-2 py-2 hover:bg-white/5"
                href="/markets"
                onClick={() => setOpen(false)}
              >
                Markets
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg px-2 py-2 hover:bg-white/5"
                href="/create"
                onClick={() => setOpen(false)}
              >
                Create Bet
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
