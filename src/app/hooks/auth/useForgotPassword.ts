// app/hooks/auth/useForgotPassword.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPasswordAction } from '@/app/actions/auth';

interface ForgotPasswordPayload {
  email: string;
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const result = await forgotPasswordAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Reset link sent! Please check your inbox.');
    },
    onError: (error) => {
      toast.error(error.message);
      console.error('Error submitting data:', error.message);
    },
  });
}
