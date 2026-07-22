import SignUpForm from '@/app/components/forms/sign-up';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-surface-low">
        <SignUpForm />
      </div>
    </Suspense>
  );
}
