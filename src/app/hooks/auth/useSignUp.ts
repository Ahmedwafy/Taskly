// app/hooks/useSignUp.ts
import { useMutation } from '@tanstack/react-query';
import { signUpAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SignUpPayload {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword?: string | number;
}

export function useSignUp() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const result = await signUpAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.message);
      console.error('Error submitting sign-up form:', error.message);
    },
  });
}
