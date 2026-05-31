import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserByEmail } from "@/lib/db";
import { normalizeRoles } from "@/lib/roles";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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
            roles: normalizeRoles(dbUser.roles),
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = normalizeRoles(user.roles);
      }
      token.roles = normalizeRoles(token.roles);
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.roles = normalizeRoles(token.roles);
      }
      return session;
    },
  },
};

