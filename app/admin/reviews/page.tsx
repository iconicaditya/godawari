"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminReviews from '@/client/pages/admin/AdminReviews';

export default function AdminReviewsRoute() {
  return (
    <AdminGuard>
      <AdminReviews />
    </AdminGuard>
  );
}
