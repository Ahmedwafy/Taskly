// app/hooks/auth/useSignOut.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/actions/auth';

export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: signOutAction,
    onSuccess: () => {
      router.replace('/login');
    },
  });
}
