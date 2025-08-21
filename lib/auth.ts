import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";

const DB_NAME =
  process.env.MONGODB_URI?.match(/mongodb.*\/([^/?]+)(\?|$)/)?.[1] ||
  "fantasybets";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const user = await db.collection("users").findOne({ email: creds.email });
        if (!user || !user.password) return null;
        const ok = await compare(creds.password, user.password);
        if (!ok) return null;
        return { id: String(user._id), email: user.email, name: user.name ?? null } as User;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.userId = (user as User).id; // User type from NextAuth
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        // extend session type safely
        (session as { userId?: string }).userId = token.userId as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
