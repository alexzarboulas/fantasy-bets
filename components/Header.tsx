// app/components/Header.tsx
"use client";

import Link from "next/link";
import { AlignJustify, User } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 z-50 h-12 bg-neutral-900/80 backdrop-blur text-white border-b border-white/10">
      {/* FULL-BLEED ROW (no max-width, no side padding) */}
      <div className="relative h-12 w-full flex items-center justify-between px-0">
        {/* Left: Menu — flush to left edge */}
        <button
          aria-label="Open menu"
          className="inline-flex h-12 w-12 items-center justify-center hover:bg-white/10"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        {/* Center: True center (viewport) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-base font-semibold tracking-tight no-underline text-white visited:text-white"
        >
          fantasy bets
        </Link>

        {/* Right: Settings dropdown (UserMenu) + Profile — flush to right edge */}
        <div className="flex items-center gap-0">
          {/* Keep your existing settings dropdown exactly as-is */}
          <UserMenu />

          {/* Profile to the RIGHT of settings */}
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex h-12 w-12 items-center justify-center hover:bg-white/10"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
