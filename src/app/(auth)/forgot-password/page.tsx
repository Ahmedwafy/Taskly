// src → app → (auth) → forgot-password → page.tsx
import ForgotPasswordForm from '@/app/components/forms/Forget-password';

export default function forgetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface-low">
      <ForgotPasswordForm />
    </div>
  );
}
