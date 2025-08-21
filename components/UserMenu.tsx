'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Settings, LogOut } from 'lucide-react';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.replace('/login'); // bounce straight to login
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Open settings menu"
        onClick={() => setOpen(v => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Settings className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-700 bg-black/90 p-1 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-black/60"
        >
          <button
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
