"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminPlants from '@/client/pages/admin/AdminPlants';

export default function AdminPlantsRoute() {
  return (
    <AdminGuard>
      <AdminPlants />
    </AdminGuard>
  );
}
