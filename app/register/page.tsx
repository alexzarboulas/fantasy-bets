"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-700 bg-black/60 p-6 shadow-lg transform -translate-y-10 sm:-translate-y-14 md:-translate-y-20">
        <h1 className="text-xl font-semibold text-white mb-1">Create account</h1>
        <p className="text-sm text-neutral-400 mb-5">
          Join and start making outrageous predictions.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const res = await fetch("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
            });
            setLoading(false);
            if (res.ok) router.push("/login");
            else {
              const { error } = await res.json().catch(() => ({ error: "Registration failed" }));
              alert(error || "Registration failed");
            }
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="block text-xs text-neutral-300 mb-1">Name (optional)</span>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              placeholder="Alex Z."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="block text-xs text-neutral-300 mb-1">Email</span>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-neutral-300 mb-1">Password</span>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            className="mt-2 w-full rounded-lg bg-indigo-300 px-3 py-2 font-medium text-black hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            disabled={loading}
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-300 underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
