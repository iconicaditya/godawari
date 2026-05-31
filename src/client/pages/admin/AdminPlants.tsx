"use client";
import { useState } from 'react';
import { Link } from '@/client/next-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { Plus, Sprout, Search, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, AdminButton, Input, Select, Badge, EmptyState } from '@/client/components/admin/ui';
import { formatPrice } from '@/client/lib/format';

type AdminPlant = {
  _id: string;
  slug: string;
  name: string;
  botanicalName: string;
  category: string;
  price: number;
  currency: string;
  stockCount: number;
  inStock: boolean;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
};

const CATEGORIES = ['all', 'indoor', 'outdoor', 'succulent', 'flowering', 'herb', 'bonsai', 'fruit'];

export default function AdminPlants() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: plants, isLoading } = useQuery({
    ...localQuery<AdminPlant[]>('admin.listPlants', { search, category }),
  });

  const { mutate: deletePlant } = useMutation({
    ...localMutation('admin.deletePlant'),
    onSuccess: () => {
      toast.success('Plant removed from the greenhouse');
      queryClient.invalidateQueries({ queryKey: ['admin.listPlants'] });
      queryClient.invalidateQueries({ queryKey: ['admin.overview'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminLayout
      title="Plants"
      subtitle="Catalog Management"
      actions={
        <Link to="/admin/plants/new">
          <AdminButton>
            <Plus className="w-3.5 h-3.5" /> Add Plant
          </AdminButton>
        </Link>
      }
    >
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-2">Search</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
              <Input
                placeholder="Name, slug, or botanical name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:w-56">
            <p className="text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-2">Category</p>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </AdminCard>

      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading plants…</div>
      ) : !plants || plants.length === 0 ? (
        <EmptyState
          Icon={Sprout}
          title="No plants in this view"
          body="Adjust your filters or add a new cultivar to begin."
          action={
            <Link to="/admin/plants/new">
              <AdminButton>
                <Plus className="w-3.5 h-3.5" /> Add Plant
              </AdminButton>
            </Link>
          }
        />
      ) : (
        <AdminCard padding={false}>
          <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 text-[10px] tracking-[0.3em] uppercase text-forest/50 border-b border-stone/50">
            <div className="col-span-4">Plant</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-stone/40">
            {plants.map((p) => (
              <div
                key={p._id}
                className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-cream/40 transition-colors"
              >
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-cream overflow-hidden flex-shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/admin/plants/${p._id}`}
                      className="font-display text-lg text-forest hover:text-terracotta transition-colors truncate block"
                    >
                      {p.name}
                    </Link>
                    <p className="italic text-xs text-forest/50 truncate">{p.botanicalName}</p>
                    <p className="text-[10px] tracking-wider text-forest/40">{p.slug}</p>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Badge>{p.category}</Badge>
                </div>
                <div className="col-span-2 md:col-span-1">
                  {p.inStock ? (
                    <span className="text-sm text-forest">{p.stockCount}</span>
                  ) : (
                    <Badge tone="danger">Out</Badge>
                  )}
                </div>
                <div className="col-span-4 md:col-span-2">
                  <p className="text-sm text-forest">{formatPrice(p.price, p.currency)}</p>
                  {p.reviewCount > 0 && (
                    <p className="text-[11px] text-forest/50">
                      ★ {p.rating.toFixed(1)} ({p.reviewCount})
                    </p>
                  )}
                </div>
                <div className="col-span-9 md:col-span-2 flex flex-wrap gap-1">
                  {p.featured && <Badge tone="info">Featured</Badge>}
                  {p.newArrival && <Badge tone="gold">New</Badge>}
                  {p.bestseller && <Badge tone="warning">Best</Badge>}
                </div>
                <div className="col-span-3 md:col-span-1 flex justify-end gap-1">
                  <a
                    href={`/plant/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View on storefront"
                    className="p-1.5 text-forest/60 hover:text-forest hover:bg-cream rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                  <Link
                    to={`/admin/plants/${p._id}`}
                    title="Edit"
                    className="p-1.5 text-forest/60 hover:text-forest hover:bg-cream rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${p.name}? This will also remove all reviews.`)) {
                        deletePlant({ id: p._id });
                      }
                    }}
                    title="Delete"
                    className="p-1.5 text-forest/60 hover:text-terracotta hover:bg-terracotta/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}


