"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-sm p-6 rounded-2xl bg-white/5">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
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
        <input className="w-full p-2 rounded bg-white/10" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 rounded bg-white/10" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-white/10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full p-2 rounded bg-white/20 hover:bg-white/30" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-400">
        Already have an account? <Link className="underline" href="/login">Log in</Link>
      </p>
    </div>
  );
}
