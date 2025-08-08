import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "fantasy-bets",
  description: "AI-powered absurd-odds betting (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 mx-auto py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
