"use client";
import { FormEvent, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { Quote, Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, AdminButton, Input, Textarea, Field, Toggle, EmptyState, Badge } from '@/client/components/admin/ui';

type Testimonial = {
  _id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarSeed: string;
  featured: boolean;
  createdAt: string | Date;
};

const empty = {
  id: '',
  name: '',
  location: '',
  quote: '',
  rating: 5,
  avatarSeed: 'leaf',
  featured: true,
};

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<typeof empty | null>(null);

  const { data: items, isLoading } = useQuery({
    ...localQuery<Testimonial[]>('admin.listTestimonials', {}),
  });

  const saveMutation = useMutation({
    ...localMutation('admin.saveTestimonial'),
    onSuccess: () => {
      toast.success('Testimonial saved');
      queryClient.invalidateQueries({ queryKey: ['admin.listTestimonials'] });
      setEditor(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { mutate: deleteTestimonial } = useMutation({
    ...localMutation('admin.deleteTestimonial'),
    onSuccess: () => {
      toast.success('Removed');
      queryClient.invalidateQueries({ queryKey: ['admin.listTestimonials'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;
    const payload: Record<string, unknown> = {
      name: editor.name,
      location: editor.location,
      quote: editor.quote,
      rating: Number(editor.rating),
      avatarSeed: editor.avatarSeed,
      featured: editor.featured,
    };
    if (editor.id) payload.id = editor.id;
    saveMutation.mutate(payload);
  }

  return (
    <AdminLayout
      title="Testimonials"
      subtitle="Voices of the Garden"
      actions={
        <AdminButton onClick={() => setEditor({ ...empty })}>
          <Plus className="w-3.5 h-3.5" /> New Testimonial
        </AdminButton>
      }
    >
      {/* Editor modal */}
      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-up">
          <div className="absolute inset-0 bg-forest-deep/40 backdrop-blur-sm" onClick={() => setEditor(null)} />
          <div className="relative bg-ivory border border-stone/60 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone/50">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                  {editor.id ? 'Edit' : 'New'} Testimonial
                </p>
                <h3 className="font-display text-2xl text-forest">{editor.id ? 'Refining a voice' : 'Add a voice'}</h3>
              </div>
              <button onClick={() => setEditor(null)} className="p-2 text-forest/60 hover:text-forest" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <Field label="Name" required>
                <Input required value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} />
              </Field>
              <Field label="Location" required>
                <Input
                  required
                  value={editor.location}
                  onChange={(e) => setEditor({ ...editor, location: e.target.value })}
                  placeholder="Kathmandu"
                />
              </Field>
              <Field label="Quote" required>
                <Textarea
                  required
                  rows={4}
                  value={editor.quote}
                  onChange={(e) => setEditor({ ...editor, quote: e.target.value })}
                  placeholder="What they said about Godawari Planthub…"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Rating" required>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={editor.rating}
                    onChange={(e) => setEditor({ ...editor, rating: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Avatar Seed" hint="Used for the placeholder portrait.">
                  <Input
                    value={editor.avatarSeed}
                    onChange={(e) => setEditor({ ...editor, avatarSeed: e.target.value })}
                  />
                </Field>
              </div>
              <Toggle
                label="Featured"
                hint="Show on the homepage testimonial section."
                checked={editor.featured}
                onChange={(v) => setEditor({ ...editor, featured: v })}
              />
              <div className="flex gap-2 pt-2">
                <AdminButton type="submit" disabled={saveMutation.isPending} className="flex-1 justify-center">
                  <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? 'Saving…' : 'Save'}
                </AdminButton>
                <AdminButton type="button" variant="ghost" onClick={() => setEditor(null)}>
                  Cancel
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading…</div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          Icon={Quote}
          title="No testimonials yet"
          body="Add the first voice from the garden — it will appear on the homepage."
          action={
            <AdminButton onClick={() => setEditor({ ...empty })}>
              <Plus className="w-3.5 h-3.5" /> Add testimonial
            </AdminButton>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((t) => (
            <AdminCard key={t._id} className="flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <Quote className="w-5 h-5 text-gold flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-display text-lg text-forest leading-relaxed mb-3">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-forest">{t.name}</p>
                      <p className="text-xs text-forest/50">{t.location}</p>
                    </div>
                    {t.featured && <Badge tone="gold">Featured</Badge>}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-stone/40 flex justify-end gap-1">
                <button
                  onClick={() =>
                    setEditor({
                      id: t._id,
                      name: t.name,
                      location: t.location,
                      quote: t.quote,
                      rating: t.rating,
                      avatarSeed: t.avatarSeed,
                      featured: t.featured,
                    })
                  }
                  className="p-1.5 text-forest/60 hover:text-forest hover:bg-cream rounded transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove testimonial from ${t.name}?`)) deleteTestimonial({ id: t._id });
                  }}
                  className="p-1.5 text-forest/60 hover:text-terracotta hover:bg-terracotta/10 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

