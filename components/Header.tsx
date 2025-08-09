"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/markets", label: "Markets" },
  { href: "/create", label: "Create Bet" },
  { href: "/account", label: "Account" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="container-px mx-auto flex h-14 items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
          <Link href="/" className="font-semibold tracking-tight">
            fantasy-bets
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 rounded-xl bg-white/5 p-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "px-3 py-1.5 rounded-lg text-sm transition",
                  active
                    ? "bg-white/90 text-neutral-900"
                    : "text-white/80 hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search (md+: inline input, else icon) */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-400/50">
            <span aria-hidden>🔎</span>
            <input
              type="search"
              placeholder="Search markets"
              className="bg-transparent placeholder-white/50 focus:outline-none text-sm w-52"
            />
          </div>
          <button
            className="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            aria-label="Open search"
          >
            🔎
          </button>
          <Link
            href="/account"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
            aria-label="Account"
          >
            👤
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="sm:hidden border-t border-white/10 bg-neutral-950">
          <ul className="container-px mx-auto py-2 space-y-1">
            {/* Optional inline search on mobile */}
            <li className="mb-1">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span aria-hidden>🔎</span>
                <input
                  type="search"
                  placeholder="Search markets"
                  className="bg-transparent placeholder-white/50 focus:outline-none text-sm w-full"
                />
              </div>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  className="block rounded-lg px-2 py-2 hover:bg-white/5"
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
