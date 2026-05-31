"use client";

import { PrivateGuard } from '@/client/route-guards';
import AccountPage from '@/client/pages/AccountPage';

export default function AccountPageRoute() {
  return (
    <PrivateGuard>
      <AccountPage />
    </PrivateGuard>
  );
}
