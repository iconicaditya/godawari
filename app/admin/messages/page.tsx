"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminMessages from '@/client/pages/admin/AdminMessages';

export default function AdminMessagesRoute() {
  return (
    <AdminGuard>
      <AdminMessages />
    </AdminGuard>
  );
}
