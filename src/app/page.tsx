'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const type = params.get('type');

    if (type === 'recovery') {
      router.push(`/reset-password${window.location.hash}`);
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}
