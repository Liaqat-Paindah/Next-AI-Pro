

import "server-only";

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoDB";
import { randomBytes, randomUUID } from "crypto";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    _id?: string; // or `string | undefined`
  }

  interface Session {
    user: User & { _id?: string };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@Ayandaha.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials === null ||
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user._id = token._id as string;
      return session;
    },
  },
});

export const { GET, POST } = handlers
