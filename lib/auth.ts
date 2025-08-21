import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        const client = await clientPromise;
        const db = client.db(); // defaults to the db in your URI (fantasybets)

        const user = await db.collection("users").findOne({ email: creds.email });
        if (!user || !user.password) return null;

        const ok = await compare(creds.password, user.password);
        if (!ok) return null;

        // minimal user object for JWT
        return { id: String(user._id), email: user.email, name: user.name ?? null };
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) (session as any).userId = token.userId;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
