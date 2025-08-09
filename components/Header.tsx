"use client";
import Link from "next/link";
import { Menu, User, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900 text-white border-b border-white/10 h-12">
      {/* 3‑column grid keeps the title centered even if right side is wider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full grid grid-cols-[auto_1fr_auto] items-center">
        {/* Left: Menu */}
        <button
          aria-label="Open menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Center: Title (always centered) */}
        <h1 className="justify-self-center text-sm font-medium tracking-tight">
          Fantasy Bets
        </h1>

        {/* Right: Profile + Settings */}
        <div className="justify-self-end flex items-center gap-1">
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
