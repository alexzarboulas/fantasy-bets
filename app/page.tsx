// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // go straight to login/register
  }

  // Logged-in view (your main app)
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold">Welcome</span>
        <form action="/api/auth/signout" method="post" className="ml-auto">
          <button className="px-3 py-2 rounded bg-white/20 hover:bg-white/30">
            Sign out
          </button>
        </form>
      </div>
      <HomeClient />
    </div>
  );
}
