"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { Star, Trash2, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, EmptyState, Badge } from '@/client/components/admin/ui';

type AdminReview = {
  _id: string;
  plantId: string;
  plantName: string;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string | Date;
};

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({
    ...localQuery<AdminReview[]>('admin.listReviews', {}),
  });

  const { mutate: deleteReview } = useMutation({
    ...localMutation('admin.deleteReview'),
    onSuccess: () => {
      toast.success('Review removed');
      queryClient.invalidateQueries({ queryKey: ['admin.listReviews'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Reviews" subtitle="Customer Voices">
      {isLoading ? (
        <div className="text-forest/50 text-sm">Loading reviews…</div>
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState Icon={Star} title="No reviews yet" body="Reviews submitted by customers appear here." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <AdminCard key={r._id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-gold text-gold' : 'text-stone'
                        }`}
                      />
                    ))}
                    {r.verified && <Badge tone="success"><BadgeCheck className="w-3 h-3" /> Verified</Badge>}
                  </div>
                  <h3 className="font-display text-xl text-forest">{r.title}</h3>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Remove this review?')) deleteReview({ id: r._id });
                  }}
                  className="p-1.5 text-forest/50 hover:text-terracotta hover:bg-terracotta/10 rounded transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-sm text-forest/80 leading-relaxed mb-4">{r.body}</p>
              <div className="mt-auto pt-4 border-t border-stone/40 flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest">{r.authorName}</p>
                  <p className="text-xs text-forest/50">{r.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-forest font-medium">{r.plantName}</p>
                  <p className="text-[10px] tracking-wider uppercase text-forest/40">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

