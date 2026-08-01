// app/hooks/auth/useSignIn.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInAction } from '@/app/actions/auth';

interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useSignIn(redirectTo?: string | null) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const result = await signInAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.user;
    },
    onSuccess: () => {
      toast.success('Welcome back!');
      router.push(redirectTo || '/projects');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
