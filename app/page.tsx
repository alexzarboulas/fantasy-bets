import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-6">
        <p>You must log in to continue.</p>
        <Link href="/login" className="underline">
          Go to login
        </Link>
      </div>
    );
  }

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
