'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInPage from './(auth)/login/page';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the URL contains recovery hash
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const type = params.get('type');

    // If recovery link is detected, redirect to reset-password with the hash
    if (type === 'recovery') {
      router.push(`/reset-password${window.location.hash}`);
    }
  }, [router]);

  return (
    <main className="bg-(--surface-low) min-h-screen">
      <SignInPage />
    </main>
  );
}
