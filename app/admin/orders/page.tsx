"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminOrders from '@/client/pages/admin/AdminOrders';

export default function AdminOrdersRoute() {
  return (
    <AdminGuard>
      <AdminOrders />
    </AdminGuard>
  );
}
