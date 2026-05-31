"use client";

import { GuestGuard } from '@/client/route-guards';
import SignupPage from '@/client/pages/SignupPage';

export default function SignupPageRoute() {
  return (
    <GuestGuard>
      <SignupPage />
    </GuestGuard>
  );
}
