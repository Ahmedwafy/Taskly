// src → app → (auth) → forgot-password → page.tsx

import ForgotPasswordForm from '@/app/components/forms/forget-password';
import { Suspense } from 'react';

export default function forgetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-surface-low">
        <ForgotPasswordForm />
      </div>
    </Suspense>
  );
}
