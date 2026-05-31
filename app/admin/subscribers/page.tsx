"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminSubscribers from '@/client/pages/admin/AdminSubscribers';

export default function AdminSubscribersRoute() {
  return (
    <AdminGuard>
      <AdminSubscribers />
    </AdminGuard>
  );
}
