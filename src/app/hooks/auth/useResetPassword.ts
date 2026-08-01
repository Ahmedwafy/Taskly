// app/hooks/auth/useResetPassword.ts
import { useMutation } from '@tanstack/react-query';
import { resetPasswordAction } from '@/app/actions/auth';

export function useResetPassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const result = await resetPasswordAction(newPassword);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
  });
}
