// src > app > (auth) > login > page.tsx
import LogInForm from '@/app/components/forms/login';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-surface-low">
        <LogInForm />
      </div>
    </Suspense>
  );
}
