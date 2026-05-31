"use client";
import { Link, useParams } from '@/client/next-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { ArrowLeft, Mail, Phone, MapPin, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, AdminButton, Badge, Select } from '@/client/components/admin/ui';
import { formatPrice } from '@/client/lib/format';

type OrderDetail = {
  _id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string | Date;
  items: Array<{ slug: string; name: string; quantity: number; price: number; image: string }>;
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const tone: Record<string, 'warning' | 'info' | 'gold' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'gold',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    ...localQuery<OrderDetail>('admin.getOrder', { id }),
    enabled: !!id,
  });

  const { mutate: updateStatus } = useMutation({
    ...localMutation('admin.updateOrderStatus'),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin.getOrder'] });
      queryClient.invalidateQueries({ queryKey: ['admin.listOrders'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminLayout
      title={data ? `Order ${data.orderNumber}` : 'Order'}
      subtitle="Order Detail"
      actions={
        <Link to="/admin/orders">
          <AdminButton variant="ghost">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </AdminButton>
        </Link>
      }
    >
      {isLoading || !data ? (
        <div className="text-forest/50 text-sm">Loading…</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard padding={false}>
              <div className="p-6 border-b border-stone/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                    Placed {new Date(data.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="font-display text-3xl text-forest">{data.orderNumber}</h3>
                </div>
                <Badge tone={tone[data.status] ?? 'neutral'}>{data.status}</Badge>
              </div>
              <div className="divide-y divide-stone/40">
                {data.items.map((it, idx) => (
                  <div key={it.slug + idx} className="flex items-center gap-4 p-6">
                    <div className="w-16 h-16 bg-cream overflow-hidden flex-shrink-0">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-forest">{it.name}</p>
                      <p className="text-xs text-forest/50">Qty {it.quantity}</p>
                    </div>
                    <p className="font-display text-base text-forest">
                      {formatPrice(it.price * it.quantity, 'NPR')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-stone/50 space-y-2">
                <div className="flex justify-between text-sm text-forest/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(data.subtotal, 'NPR')}</span>
                </div>
                <div className="flex justify-between text-sm text-forest/70">
                  <span>Shipping</span>
                  <span>{data.shipping === 0 ? 'Complimentary' : formatPrice(data.shipping, 'NPR')}</span>
                </div>
                <div className="flex justify-between font-display text-2xl text-forest pt-3 border-t border-stone/50">
                  <span>Total</span>
                  <span>{formatPrice(data.total, 'NPR')}</span>
                </div>
              </div>
            </AdminCard>

            {data.notes && (
              <AdminCard>
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-forest/40 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-forest/50 mb-1">Customer note</p>
                    <p className="text-sm text-forest leading-relaxed">{data.notes}</p>
                  </div>
                </div>
              </AdminCard>
            )}
          </div>

          <div className="space-y-6">
            <AdminCard>
              <p className="text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-3">Update Status</p>
              <Select
                value={data.status}
                onChange={(e) => updateStatus({ id: data._id, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </AdminCard>

            <AdminCard>
              <h4 className="font-display text-xl text-forest mb-4">Customer</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-forest/40 w-4 mt-0.5">·</span>
                  <p className="text-forest">{data.fullName}</p>
                </div>
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-start gap-3 hover:text-terracotta transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-forest/40 mt-0.5" />
                  <span>{data.email}</span>
                </a>
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-start gap-3 hover:text-terracotta transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-forest/40 mt-0.5" />
                  <span>{data.phone}</span>
                </a>
              </div>
            </AdminCard>

            <AdminCard>
              <h4 className="font-display text-xl text-forest mb-4">Shipping Address</h4>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-3.5 h-3.5 text-forest/40 mt-1 flex-shrink-0" />
                <div className="text-forest leading-relaxed">
                  {data.address}
                  <br />
                  {data.city}
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


