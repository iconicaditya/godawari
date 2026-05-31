"use client";

import { GuestGuard } from '@/client/route-guards';
import LoginPage from '@/client/pages/LoginPage';

export default function LoginPageRoute() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
