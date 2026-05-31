"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { ShoppingBag, Search, Eye } from 'lucide-react';
import { Link } from '@/client/next-router';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, Input, Select, Badge, EmptyState } from '@/client/components/admin/ui';
import { formatPrice } from '@/client/lib/format';

type AdminOrder = {
  _id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  total: number;
  status: string;
  createdAt: string | Date;
  items: Array<{ slug: string; name: string; quantity: number; price: number; image: string }>;
};

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const tone: Record<string, 'warning' | 'info' | 'gold' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'gold',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminOrders() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    ...localQuery<AdminOrder[]>('admin.listOrders', { status, search }),
  });

  const { mutate: updateStatus } = useMutation({
    ...localMutation('admin.updateOrderStatus'),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin.listOrders'] });
      queryClient.invalidateQueries({ queryKey: ['admin.overview'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Orders" subtitle="Fulfilment Queue">
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-2">Search</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
              <Input
                placeholder="Order number, name, or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:w-56">
            <p className="text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-2">Status</p>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </AdminCard>

      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading orders…</div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          Icon={ShoppingBag}
          title="No orders"
          body="When customers place orders, they will appear here for fulfilment."
        />
      ) : (
        <AdminCard padding={false}>
          <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 text-[10px] tracking-[0.3em] uppercase text-forest/50 border-b border-stone/50">
            <div className="col-span-2">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-1">Items</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-stone/40">
            {orders.map((o) => (
              <div
                key={o._id}
                className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-cream/40 transition-colors"
              >
                <div className="col-span-12 md:col-span-2">
                  <p className="font-display text-base text-forest">{o.orderNumber}</p>
                </div>
                <div className="col-span-8 md:col-span-3">
                  <p className="text-sm text-forest">{o.fullName}</p>
                  <p className="text-xs text-forest/50 truncate">{o.email}</p>
                </div>
                <div className="col-span-4 md:col-span-1 text-sm text-forest/70">
                  {o.items.length}
                </div>
                <div className="col-span-6 md:col-span-2 font-display text-lg text-forest">
                  {formatPrice(o.total, 'NPR')}
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Select
                    value={o.status}
                    onChange={(e) => updateStatus({ id: o._id, status: e.target.value })}
                    className="text-xs"
                  >
                    {STATUSES.filter((s) => s !== 'all').map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <div className="mt-1.5">
                    <Badge tone={tone[o.status] ?? 'neutral'}>{o.status}</Badge>
                  </div>
                </div>
                <div className="col-span-9 md:col-span-1 text-xs text-forest/50">
                  {new Date(o.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-3 md:col-span-1 flex justify-end">
                  <Link
                    to={`/admin/orders/${o._id}`}
                    title="View details"
                    className="p-1.5 text-forest/60 hover:text-forest hover:bg-cream rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}


