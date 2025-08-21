"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-sm p-6 rounded-2xl bg-white/5">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await signIn("credentials", { redirect: false, email, password });
          setLoading(false);
          if (!res?.error) router.push("/"); // redirect to main page
          else alert(res.error);
        }}
        className="space-y-3"
      >
        <input className="w-full p-2 rounded bg-white/10" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-white/10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full p-2 rounded bg-white/20 hover:bg-white/30" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-400">
        No account? <Link className="underline" href="/register">Create one</Link>
      </p>
    </div>
  );
}
