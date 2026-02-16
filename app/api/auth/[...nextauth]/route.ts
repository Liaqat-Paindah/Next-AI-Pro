import "server-only";

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoDB";
import { randomBytes, randomUUID } from "crypto";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    _id?: string; // or `string | undefined`
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar?: string;
  }

  interface Session {
    user: User & {
      _id?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      avatar?: string;
    };
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

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const user = await res.json();
        if (res.ok && user?.user) {
          return {
            _id: user.user._id,
            email: user.user.email,
            first_name: user.user.first_name,
            last_name: user.user.last_name,
            role: user.user.role,
            avatar: user.user.avatar,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.email = token.email as string;
      session.user.first_name = token.first_name as string;
      session.user.last_name = token.last_name as string;
      session.user.phone = token.phone as string;
      session.user.avatar = token.avatar as string;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
