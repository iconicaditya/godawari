"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminOrderDetail from '@/client/pages/admin/AdminOrderDetail';

export default function AdminOrderDetailRoute() {
  return (
    <AdminGuard>
      <AdminOrderDetail />
    </AdminGuard>
  );
}
