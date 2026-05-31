"use client";

import type { ComponentProps } from "react";
import NextLink from "next/link";
import {
  usePathname,
  useSearchParams as useNextSearchParams,
  useRouter,
  useParams as useNextParams,
} from "next/navigation";
import { useEffect } from "react";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href" | "className"> & {
  to: string;
  className?: string | ((props: { isActive: boolean }) => string);
};

export function Link({ to, className, ...props }: LinkProps) {
  const computedClass = typeof className === "function" ? className({ isActive: false }) : className;
  return <NextLink href={to} className={computedClass} {...props} />;
}

export function NavLink({ to, end, className, ...props }: LinkProps & { end?: boolean }) {
  const pathname = usePathname() ?? "";
  const normalizedTo = to === "/" ? "/" : to.replace(/\/+$/, "");
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const isActive = end ? normalizedPath === normalizedTo : normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  const computedClass = typeof className === "function" ? className({ isActive }) : className;
  return <NextLink href={to} className={computedClass} {...props} />;
}

export function useLocation() {
  const pathname = usePathname() ?? "";
  const searchParams = useNextSearchParams();
  const search = searchParams.toString();
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: null,
  };
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const setSearchParams = (next: URLSearchParams, options?: { replace?: boolean }) => {
    const search = next.toString();
    const href = `${pathname}${search ? `?${search}` : ""}`;
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  return [searchParams, setSearchParams] as const;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
}

export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>() {
  return useNextParams() as Readonly<T>;
}
