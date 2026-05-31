import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserByEmail } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const fallbackUsers = [
  {
    id: "local-admin",
    name: "Godawari Admin",
    email: "admin@gmail.com",
    password: "Admin@123",
    roles: ["admin"],
  },
  {
    id: "local-customer",
    name: "Godawari Customer",
    email: "customer@godawari.local",
    password: "password",
    roles: ["customer"],
  },
];

export const authConfig: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const dbUser = await findUserByEmail(email);
        if (dbUser) {
          const valid = await bcrypt.compare(password, dbUser.password_hash);
          if (!valid) return null;
          return {
            id: dbUser.id,
            name: dbUser.name ?? dbUser.email,
            email: dbUser.email,
            roles: dbUser.roles,
          };
        }

        const fallback = fallbackUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
        if (!fallback || fallback.password !== password) {
          return null;
        }

        return {
          id: fallback.id,
          name: fallback.name,
          email: fallback.email,
          roles: fallback.roles,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles ?? [];
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.roles = token.roles ?? [];
      }
      return session;
    },
  },
};

