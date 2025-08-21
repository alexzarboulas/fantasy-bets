"use client";

import Link from "next/link";
import { AlignJustify } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-12 bg-neutral-900/80 backdrop-blur text-white border-b border-white/10">
      {/* SINGLE ROW */}
      <div className="relative mx-auto w-full max-w-6xl h-12 px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Left: Menu */}
        <button
          aria-label="Open menu"
          className="mr-auto inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 bg-transparent border-none outline-none"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        {/* Center: True center */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-base font-semibold tracking-tight no-underline text-white visited:text-white"
        >
          fantasy bets
        </Link>

        {/* Right: User menu (settings dropdown with Log out) */}
        <div className="ml-auto flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
