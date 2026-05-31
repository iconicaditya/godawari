"use client";
import { useQuery } from '@tanstack/react-query';
import { localQuery } from '@/client/lib/localData';
import { Link } from '@/client/next-router';
import {
  Sprout,
  ShoppingBag,
  Star,
  Mail,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { StatTile, AdminCard, Badge, AdminButton } from '@/client/components/admin/ui';
import { formatPrice } from '@/client/lib/format';

type Overview = {
  stats: {
    plantsCount: number;
    ordersCount: number;
    reviewsCount: number;
    subsCount: number;
    msgsCount: number;
    revenue: number;
    pendingOrders: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    fullName: string;
    email: string;
    total: number;
    status: string;
    createdAt: string | Date;
    itemCount: number;
  }>;
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string | Date;
  }>;
  topPlants: Array<{
    _id: string;
    slug: string;
    name: string;
    botanicalName: string;
    images: string[];
    price: number;
    rating: number;
    reviewCount: number;
    currency: string;
  }>;
};

const statusTone: Record<string, 'warning' | 'info' | 'gold' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'gold',
  delivered: 'success',
  cancelled: 'danger',
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    ...localQuery<Overview>('admin.overview', {}),
  });

  return (
    <AdminLayout title="Overview" subtitle="The Greenhouse at a Glance">
      {isLoading || !data ? (
        <div className="text-forest/50 text-sm">Loading metrics…</div>
      ) : (
        <div className="space-y-10">
          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            <StatTile
              label="Revenue"
              value={formatPrice(data.stats.revenue, 'NPR')}
              delta={`${data.stats.ordersCount} total orders`}
              Icon={TrendingUp}
              accent="gold"
            />
            <StatTile
              label="Pending Orders"
              value={data.stats.pendingOrders}
              delta="Awaiting fulfilment"
              Icon={Clock}
              accent="terracotta"
            />
            <StatTile label="Catalog" value={data.stats.plantsCount} delta="Live products" Icon={Sprout} />
            <StatTile
              label="Subscribers"
              value={data.stats.subsCount}
              delta={`${data.stats.msgsCount} messages`}
              Icon={Mail}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <AdminCard className="lg:col-span-2 animate-fade-up" padding={false}>
              <div className="flex items-center justify-between p-6 border-b border-stone/50">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Latest activity</p>
                  <h3 className="font-display text-2xl text-forest">Recent Orders</h3>
                </div>
                <Link to="/admin/orders">
                  <AdminButton variant="outline" size="sm">
                    View all <ArrowRight className="w-3 h-3" />
                  </AdminButton>
                </Link>
              </div>
              <div className="divide-y divide-stone/40">
                {data.recentOrders.length === 0 && (
                  <div className="p-8 text-sm text-forest/50">No orders yet.</div>
                )}
                {data.recentOrders.map((o) => (
                  <Link
                    key={o._id}
                    to={`/admin/orders/${o._id}`}
                    className="grid grid-cols-12 gap-3 px-6 py-4 hover:bg-cream/40 transition-colors items-center group"
                  >
                    <div className="col-span-12 md:col-span-3">
                      <p className="font-display text-base text-forest group-hover:text-terracotta transition-colors">
                        {o.orderNumber}
                      </p>
                      <p className="text-[11px] text-forest/50 mt-0.5">{o.itemCount} items</p>
                    </div>
                    <div className="col-span-7 md:col-span-4">
                      <p className="text-sm text-forest">{o.fullName}</p>
                      <p className="text-xs text-forest/50 truncate">{o.email}</p>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Badge tone={statusTone[o.status] ?? 'neutral'}>{o.status}</Badge>
                    </div>
                    <div className="col-span-2 md:col-span-3 text-right">
                      <p className="font-display text-lg text-forest">{formatPrice(o.total, 'NPR')}</p>
                      <p className="text-[10px] tracking-wider uppercase text-forest/40">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </AdminCard>

            {/* Recent Messages */}
            <AdminCard className="animate-fade-up" padding={false}>
              <div className="flex items-center justify-between p-6 border-b border-stone/50">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Inbox</p>
                  <h3 className="font-display text-2xl text-forest">Messages</h3>
                </div>
                <Link to="/admin/messages">
                  <AdminButton variant="ghost" size="sm">
                    <ArrowRight className="w-3 h-3" />
                  </AdminButton>
                </Link>
              </div>
              <div className="divide-y divide-stone/40">
                {data.recentMessages.length === 0 && (
                  <div className="p-6 text-sm text-forest/50">No messages.</div>
                )}
                {data.recentMessages.map((m) => (
                  <div key={m._id} className="px-6 py-4 hover:bg-cream/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-forest/40 mt-1 flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-forest truncate">{m.subject}</p>
                        <p className="text-xs text-forest/60 truncate">
                          {m.name} · {m.email}
                        </p>
                        <p className="text-[10px] tracking-wider uppercase text-forest/40 mt-1">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>

          {/* Top Plants */}
          <div className="animate-fade-up">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Performance</p>
                <h3 className="font-display text-3xl text-forest">Highest-rated Cultivars</h3>
              </div>
              <Link to="/admin/plants">
                <AdminButton variant="outline" size="sm">
                  Manage Catalog
                </AdminButton>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.topPlants.map((p) => (
                <Link
                  to={`/admin/plants/${p._id}`}
                  key={p._id}
                  className="group bg-ivory border border-stone/60 hover:border-forest/30 transition-colors"
                >
                  <div className="aspect-[4/5] bg-cream overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-forest/50">
                      {p.botanicalName}
                    </p>
                    <h4 className="font-display text-lg text-forest truncate">{p.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-forest">{formatPrice(p.price, p.currency)}</span>
                      <span className="flex items-center gap-1 text-xs text-forest/60">
                        <Star className="w-3 h-3 fill-gold text-gold" /> {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-3 gap-4 animate-fade-up">
            {[
              { to: '/admin/plants/new', label: 'Add new plant', Icon: Sprout },
              { to: '/admin/testimonials', label: 'Manage testimonials', Icon: Star },
              { to: '/admin/orders', label: 'View all orders', Icon: ShoppingBag },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="bg-forest text-cream p-6 group flex items-center justify-between hover:bg-forest-deep transition-colors"
              >
                <div className="flex items-center gap-3">
                  <c.Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  <span className="text-sm tracking-[0.18em] uppercase">{c.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


