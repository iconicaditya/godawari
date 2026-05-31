"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { Mail, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, AdminButton, EmptyState } from '@/client/components/admin/ui';

type Subscriber = {
  _id: string;
  email: string;
  createdAt: string | Date;
};

export default function AdminSubscribers() {
  const queryClient = useQueryClient();
  const { data: subs, isLoading } = useQuery({
    ...localQuery<Subscriber[]>('admin.listSubscribers', {}),
  });

  const { mutate: deleteSubscriber } = useMutation({
    ...localMutation('admin.deleteSubscriber'),
    onSuccess: () => {
      toast.success('Subscriber removed');
      queryClient.invalidateQueries({ queryKey: ['admin.listSubscribers'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function exportCsv() {
    if (!subs?.length) return;
    const csv = ['email,date_subscribed', ...subs.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `godawari-subscribers-${Date.now()}.csv`;
    a.click();
  }

  return (
    <AdminLayout
      title="Newsletter"
      subtitle="The Sunday Garden List"
      actions={
        <AdminButton variant="outline" size="sm" onClick={exportCsv} disabled={!subs?.length}>
          <Download className="w-3.5 h-3.5" /> Export CSV
        </AdminButton>
      }
    >
      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading…</div>
      ) : !subs || subs.length === 0 ? (
        <EmptyState
          Icon={Mail}
          title="No subscribers yet"
          body="As people subscribe to your newsletter from the storefront, their emails will appear here."
        />
      ) : (
        <AdminCard padding={false}>
          <div className="flex items-center justify-between p-6 border-b border-stone/50">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{subs.length} subscribers</p>
              <h3 className="font-display text-2xl text-forest">Mailing List</h3>
            </div>
          </div>
          <div className="divide-y divide-stone/40">
            {subs.map((s) => (
              <div key={s._id} className="flex items-center gap-4 px-6 py-4 hover:bg-cream/40 transition-colors">
                <Mail className="w-4 h-4 text-forest/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-forest truncate">{s.email}</p>
                  <p className="text-[10px] tracking-wider uppercase text-forest/40">
                    Subscribed {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${s.email} from the list?`)) deleteSubscriber({ id: s._id });
                  }}
                  className="p-1.5 text-forest/50 hover:text-terracotta hover:bg-terracotta/10 rounded transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}

