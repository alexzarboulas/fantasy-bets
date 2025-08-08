"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto flex h-14 items-center justify-between">
        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 sm:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* Title */}
        <Link href="/" className="text-base font-semibold tracking-tight">
          fantasy-bets
        </Link>

        {/* Right-side buttons */}
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
            🔎
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
            👤
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="sm:hidden border-t border-white/10 bg-neutral-950">
          <ul className="px-4 py-2 space-y-1">
            <li><Link href="/markets" className="block rounded-lg px-2 py-2 hover:bg-white/5">Markets</Link></li>
            <li><Link href="/create" className="block rounded-lg px-2 py-2 hover:bg-white/5">Create Bet</Link></li>
            <li><Link href="/account" className="block rounded-lg px-2 py-2 hover:bg-white/5">Account</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
