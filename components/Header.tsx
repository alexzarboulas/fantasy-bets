"use client";
import Link from "next/link";
import { Menu, User, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-12 bg-neutral-900/80 backdrop-blur text-white border-b border-white/10">
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full grid items-center"
        style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}
      >
        {/* Left: Menu */}
        <div className="justify-self-start">
          <button
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Title */}
        <div className="justify-self-center">
          <Link href="/" className="text-sm sm:text-base font-semibold tracking-tight">
            fantasy bets
          </Link>
        </div>

        {/* Right: Settings + Profile */}
        <div className="justify-self-end flex items-center gap-1.5">
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
