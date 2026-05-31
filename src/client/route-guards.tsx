"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession } from '@/client/lib/localData';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (user) {
      const redirect = params.get("_redirect");
      router.replace(redirect ?? "/");
    }
  }, [user, router, params]);

  if (user) return null;
  return <>{children}</>;
}

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      const search = params.toString();
      const fullPath = pathname + (search ? `?${search}` : "");
      router.replace(`/login?_redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [user, router, pathname, params]);

  if (!user) return null;
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/login");
    } else if (!user.hasRole("admin")) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;
  if (!user.hasRole("admin")) return null;
  return <>{children}</>;
}
