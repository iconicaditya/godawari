"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminDashboard from '@/client/pages/admin/AdminDashboard';

export default function AdminDashboardRoute() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
