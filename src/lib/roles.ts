export const APP_ROLES = ["customer", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export function isAppRole(role: unknown): role is AppRole {
  return typeof role === "string" && (APP_ROLES as readonly string[]).includes(role);
}

export function normalizeRoles(roles: unknown): AppRole[] {
  const input = Array.isArray(roles) ? roles : [];
  const normalized = input.filter(isAppRole);
  return normalized.length ? Array.from(new Set(normalized)) : ["customer"];
}

export function hasRole(roles: unknown, role: AppRole) {
  return normalizeRoles(roles).includes(role);
}
