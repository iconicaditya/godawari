"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { MessageSquare, Trash2, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, EmptyState, AdminButton } from '@/client/components/admin/ui';

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string | Date;
};

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState<Message | null>(null);
  const { data: messages, isLoading } = useQuery({
    ...localQuery<Message[]>('admin.listMessages', {}),
  });

  const { mutate: deleteMessage } = useMutation({
    ...localMutation('admin.deleteMessage'),
    onSuccess: () => {
      toast.success('Message removed');
      queryClient.invalidateQueries({ queryKey: ['admin.listMessages'] });
      setActive(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Messages" subtitle="Inbox">
      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading…</div>
      ) : !messages || messages.length === 0 ? (
        <EmptyState
          Icon={MessageSquare}
          title="No messages"
          body="Messages from your contact form will appear here."
        />
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <AdminCard padding={false} className="lg:col-span-5">
            <div className="p-5 border-b border-stone/50">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{messages.length} threads</p>
              <h3 className="font-display text-2xl text-forest">All Messages</h3>
            </div>
            <div className="divide-y divide-stone/40 max-h-[700px] overflow-y-auto">
              {messages.map((m) => (
                <button
                  key={m._id}
                  onClick={() => setActive(m)}
                  className={`w-full text-left px-5 py-4 hover:bg-cream/50 transition-colors ${
                    active?._id === m._id ? 'bg-cream/70 border-l-2 border-gold pl-[18px]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-forest truncate">{m.name}</p>
                    <p className="text-[10px] tracking-wider uppercase text-forest/40 flex-shrink-0 ml-3">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-forest/80 truncate">{m.subject}</p>
                  <p className="text-xs text-forest/50 truncate mt-0.5">{m.message}</p>
                </button>
              ))}
            </div>
          </AdminCard>

          <div className="lg:col-span-7">
            {active ? (
              <AdminCard className="animate-fade-up">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">From</p>
                    <h3 className="font-display text-3xl text-forest leading-tight">{active.subject}</h3>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <p className="text-forest">{active.name}</p>
                      <span className="text-forest/30">·</span>
                      <a href={`mailto:${active.email}`} className="text-forest/70 hover:text-terracotta link-underline">
                        {active.email}
                      </a>
                    </div>
                    <p className="text-[10px] tracking-wider uppercase text-forest/40 mt-2">
                      {new Date(active.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="p-2 text-forest/50 hover:text-forest"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-cream/40 border-l-2 border-gold/40 p-5 my-6">
                  <p className="text-sm text-forest leading-relaxed whitespace-pre-wrap">{active.message}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}>
                    <AdminButton>
                      <Mail className="w-3.5 h-3.5" /> Reply via email
                    </AdminButton>
                  </a>
                  <AdminButton
                    variant="danger"
                    onClick={() => {
                      if (confirm('Delete this message?')) deleteMessage({ id: active._id });
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </AdminButton>
                </div>
              </AdminCard>
            ) : (
              <AdminCard className="text-center py-20">
                <MessageSquare className="w-8 h-8 text-forest/30 mx-auto mb-4" strokeWidth={1.2} />
                <p className="text-sm text-forest/50">Select a message to read</p>
              </AdminCard>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

