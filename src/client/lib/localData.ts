"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession as useNextAuthSession } from "next-auth/react";

export type LocalUser = {
  id: string;
  handle: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  hasRole: (role: string) => boolean;
  requireRole: (role: string) => void;
};

export type PlantData = {
  _id: string;
  slug: string;
  name: string;
  botanicalName: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  careLevel: string;
  light: string;
  water: string;
  height: string;
  potIncluded: boolean;
  images: string[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
};

export type ReviewData = {
  _id: string;
  plantId: string;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
};

export type CartItemData = {
  plantId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartData = {
  items: CartItemData[];
  subtotal: number;
};

const IMG = {
  monstera: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1200&q=80",
  fiddle: "https://images.unsplash.com/photo-1597055181449-b3d4f1f8c2b8?w=1200&q=80",
  snake: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=1200&q=80",
  pothos: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=1200&q=80",
  orchid: "https://images.unsplash.com/photo-1567686157466-5a6e6c1b1c20?w=1200&q=80",
  cactus: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200&q=80",
  bonsai: "https://images.unsplash.com/photo-1599598425947-5fbc56e3d59f?w=1200&q=80",
  lemon: "https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=1200&q=80",
};

export const plants: PlantData[] = [
  plant("1", "monstera-deliciosa", "Monstera Deliciosa", "Monstera deliciosa", "indoor", 1450, IMG.monstera, true, false, true),
  plant("2", "fiddle-leaf-fig", "Fiddle Leaf Fig", "Ficus lyrata", "indoor", 2200, IMG.fiddle, true, true, false),
  plant("3", "snake-plant-laurentii", "Snake Plant Laurentii", "Sansevieria trifasciata", "indoor", 750, IMG.snake, true, false, true),
  plant("4", "golden-pothos", "Golden Pothos", "Epipremnum aureum", "indoor", 480, IMG.pothos, false, false, true),
  plant("5", "phalaenopsis-orchid", "Phalaenopsis Orchid", "Phalaenopsis", "flowering", 1850, IMG.orchid, true, true, false),
  plant("6", "desert-cactus-bowl", "Desert Cactus Bowl", "Cactaceae", "succulent", 980, IMG.cactus, false, true, true),
  plant("7", "ficus-bonsai", "Ficus Bonsai", "Ficus microcarpa", "bonsai", 4200, IMG.bonsai, true, false, true),
  plant("8", "meyer-lemon-tree", "Meyer Lemon Tree", "Citrus × meyeri", "fruit", 2600, IMG.lemon, false, true, false),
];

function plant(
  _id: string,
  slug: string,
  name: string,
  botanicalName: string,
  category: string,
  price: number,
  image: string,
  featured: boolean,
  newArrival: boolean,
  bestseller: boolean,
): PlantData {
  return {
    _id,
    slug,
    name,
    botanicalName,
    category,
    price,
    compareAtPrice: Math.round(price * 1.18),
    shortDescription: `A carefully grown ${name.toLowerCase()} selected for refined homes and gardens.`,
    description: `This ${name} is cultivated by Godawari Nursery with attention to shape, health, and long-term indoor performance. It arrives acclimatised, nursery-inspected, and ready for display.`,
    careLevel: category === "succulent" ? "easy" : "moderate",
    light: "Bright, indirect",
    water: category === "succulent" ? "Every 2–3 weeks" : "Weekly, when topsoil dries",
    height: category === "bonsai" ? "25–40 cm" : "45–90 cm",
    potIncluded: true,
    images: [image],
    tags: [category, featured ? "featured" : "nursery-grown", bestseller ? "bestseller" : "fresh"],
    inStock: true,
    stockCount: 18,
    featured,
    newArrival,
    bestseller,
    rating: 4.7,
    reviewCount: 48,
  };
}

export const testimonials = [
  { _id: "t1", name: "Anisha Shrestha", location: "Lalitpur", quote: "Every plant arrived healthier than expected, with beautiful care notes.", rating: 5 },
  { _id: "t2", name: "Rohit Karki", location: "Kathmandu", quote: "The bonsai collection is exceptional and the delivery was careful.", rating: 5 },
  { _id: "t3", name: "Maya Gurung", location: "Bhaktapur", quote: "Our balcony finally feels like a calm green room.", rating: 4 },
];

export const reviews: ReviewData[] = plants.slice(0, 4).map((p, index) => ({
  _id: `r${index + 1}`,
  plantId: p._id,
  name: ["Aarav", "Nisha", "Suman", "Pema"][index],
  rating: index === 2 ? 4 : 5,
  comment: "Healthy plant, elegant packaging, and helpful care guidance.",
  verified: true,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
}));

const STORAGE_KEY = "godawari-cart";
const USER_KEY = "godawari-user";

function readCart(): CartData {
  if (typeof window === "undefined") return { items: [], subtotal: 0 };
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CartItemData[];
  return { items: parsed, subtotal: parsed.reduce((sum, item) => sum + item.price * item.quantity, 0) };
}

function writeCart(items: CartItemData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("godawari-cart"));
}

function makeUser(email: string): LocalUser {
  const roles = email.toLowerCase().includes("admin") ? ["admin"] : [];
  return {
    id: "local-user",
    handle: email,
    roles,
    firstName: email.split("@")[0],
    hasRole: (role) => roles.includes(role),
    requireRole: (role) => {
      if (!roles.includes(role)) throw new Error(`Access denied - role '${role}' required`);
    },
  };
}

export function useSession() {
  const { data } = useNextAuthSession();
  const user = data?.user?.email
    ? makeUserFromSession(data.user.email, data.user.roles ?? [], data.user.name ?? undefined, data.user.id)
    : null;
  return { user };
}

function makeUserFromSession(email: string, roles: string[], name?: string, id = "session-user"): LocalUser {
  return {
    id,
    handle: email,
    roles,
    firstName: name ?? email.split("@")[0],
    hasRole: (role) => roles.includes(role),
    requireRole: (role) => {
      if (!roles.includes(role)) throw new Error(`Access denied - role '${role}' required`);
    },
  };
}

export async function login(input: string | { email: string; password?: string }) {
  const email = typeof input === "string" ? input : input.email;
  localStorage.setItem(USER_KEY, email);
  return makeUser(email);
}

export async function signup(input: string | { email: string; password?: string }) {
  return login(input);
}

export async function signOut() {
  localStorage.removeItem(USER_KEY);
}

export function getConfig(key: string) {
  if (key === "_system.env.type") return "local";
  return undefined;
}

export function createQueryKey(method: string, args: Record<string, unknown> = {}) {
  return [method, args];
}

export function localQuery<T>(method: string, args: Record<string, unknown> = {}) {
  return { queryKey: createQueryKey(method, args), queryFn: () => callLocalMethod<T>(method, args) };
}

export function localMutation<T = unknown>(method: string) {
  return { mutationFn: (args: Record<string, unknown>) => callLocalMethod<T>(method, args) };
}

export async function callLocalMethod<T>(method: string, args: Record<string, unknown> = {}): Promise<T> {
  await Promise.resolve();
  switch (method) {
    case "nursery.listPlants": {
      let result = [...plants];
      if (args.category) result = result.filter((p) => p.category === args.category);
      if (args.featured) result = result.filter((p) => p.featured);
      if (args.newArrival) result = result.filter((p) => p.newArrival);
      if (args.bestseller) result = result.filter((p) => p.bestseller);
      if (args.search) result = result.filter((p) => p.name.toLowerCase().includes(String(args.search).toLowerCase()));
      if (args.limit) result = result.slice(0, Number(args.limit));
      return result as T;
    }
    case "nursery.getPlant":
      return (plants.find((p) => p.slug === args.slug || p._id === args.id) ?? null) as T;
    case "nursery.relatedPlants":
      return plants.filter((p) => p.category === args.category && p.slug !== args.slug).slice(0, 4) as T;
    case "nursery.listTestimonials":
    case "admin.listTestimonials":
      return testimonials as T;
    case "nursery.getReviews":
    case "admin.listReviews":
      return reviews.filter((r) => !args.plantId || r.plantId === args.plantId) as T;
    case "nursery.getCart":
      return readCart() as T;
    case "nursery.addToCart": {
      const selected = plants.find((p) => p._id === args.plantId || p.slug === args.slug);
      if (!selected) return readCart() as T;
      const cart = readCart().items;
      const existing = cart.find((item) => item.plantId === selected._id || item.slug === selected.slug);
      if (existing) existing.quantity += Number(args.quantity ?? 1);
      else cart.push({ plantId: selected._id, name: selected.name, slug: selected.slug, price: selected.price, image: selected.images[0], quantity: Number(args.quantity ?? 1) });
      writeCart(cart);
      return readCart() as T;
    }
    case "nursery.updateCartItem": {
      const cart = readCart().items.map((item) => item.plantId === args.plantId || item.slug === args.slug ? { ...item, quantity: Number(args.quantity) } : item).filter((item) => item.quantity > 0);
      writeCart(cart);
      return readCart() as T;
    }
    case "nursery.clearCart":
      writeCart([]);
      return readCart() as T;
    case "nursery.placeOrder":
      writeCart([]);
      return { orderNumber: `GN-${Date.now().toString().slice(-6)}`, total: readCart().subtotal } as T;
    case "admin.overview":
      return { plants: plants.length, orders: 3, subscribers: 24, messages: 2, reviews: reviews.length, revenue: 12800 } as T;
    case "admin.listPlants":
      return plants as T;
    case "admin.getPlant":
      return plants.find((p) => p._id === args.id) as T;
    case "admin.listOrders":
      return [] as T;
    case "admin.getOrder":
      return null as T;
    case "admin.listMessages":
    case "admin.listSubscribers":
      return [] as T;
    default:
      return { success: true } as T;
  }
}

export function useCartSnapshot() {
  const [cart, setCart] = useState<CartData>({ items: [], subtotal: 0 });
  const refresh = useCallback(() => setCart(readCart()), []);
  useEffect(() => {
    refresh();
    window.addEventListener("godawari-cart", refresh);
    return () => window.removeEventListener("godawari-cart", refresh);
  }, [refresh]);
  return { cart, refresh };
}
