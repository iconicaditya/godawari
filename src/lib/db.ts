import { Pool } from "pg";
import { normalizeRoles } from "@/lib/roles";

const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({ connectionString })
  : null;

export type DbUser = {
  id: string;
  name: string | null;
  email: string;
  password_hash: string;
  roles: string[];
};

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  if (!pool) {
    return null;
  }

  const { rows } = await pool.query<DbUser>(
    `select id, name, email, password_hash, roles from users where lower(email) = lower($1) limit 1`,
    [email]
  );
  const user = rows[0];
  return user ? { ...user, roles: normalizeRoles(user.roles) } : null;
}

export async function createUser(input: { name?: string; email: string; passwordHash: string }): Promise<DbUser> {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }

  const { rows } = await pool.query<DbUser>(
    `insert into users (name, email, password_hash, roles)
     values ($1, lower($2), $3, array['customer'])
     returning id, name, email, password_hash, roles`,
    [input.name ?? null, input.email, input.passwordHash]
  );
  return { ...rows[0], roles: normalizeRoles(rows[0].roles) };
}
