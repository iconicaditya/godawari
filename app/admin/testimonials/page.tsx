"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminTestimonials from '@/client/pages/admin/AdminTestimonials';

export default function AdminTestimonialsRoute() {
  return (
    <AdminGuard>
      <AdminTestimonials />
    </AdminGuard>
  );
}
