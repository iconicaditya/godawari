"use client";

import { AdminGuard } from '@/client/route-guards';
import AdminPlantEditor from '@/client/pages/admin/AdminPlantEditor';

export default function AdminPlantEditorRoute() {
  return (
    <AdminGuard>
      <AdminPlantEditor />
    </AdminGuard>
  );
}
