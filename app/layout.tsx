import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "fantasy-bets",
  description: "AI-powered absurd-odds betting (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-brand text-ink antialiased`}>
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
