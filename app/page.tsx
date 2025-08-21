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
      </div>
      <HomeClient />
    </div>
  );
}
