// src → app → components → forms → reset-password.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/atoms/Button';
import Link from 'next/link';
import InputField from '../atoms/input';
import { useResetPassword } from '@/app/hooks/auth/useResetPassword';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [accessToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    return type === 'recovery' ? token : null;
  });
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [passwordValue, setPasswordValue] = useState('');
  const password = passwordValue;
  const hasLength = password.length >= 8 && password.length <= 64;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (value.length > 64) return 'Password must be at most 64 characters.';
    if (/\s/.test(value)) return 'Password must not contain whitespace.';
    if (!/[A-Z]/.test(value))
      return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(value))
      return 'Password must contain a lowercase letter.';

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(value)) {
      return 'Password must contain a special character.';
    }

    return true;
  };

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = useCallback(
    (data: ResetPasswordFormData) => {
      resetPassword(data.password, {
        onSuccess: () => {
          setSuccessMessage(
            'Your password has been updated successfully. You can now log in.',
          );

          timeoutRef.current = setTimeout(() => {
            router.push('/login');
          }, 3000);
        },
        onError: (error) => {
          console.error('Error resetting password:', error.message);

          setError('password', {
            type: 'server',
            message:
              error.message || 'Failed to reset password. Please try again.',
          });
        },
      });
    },
    [resetPassword, router, setError],
  );

  const passwordRegister = register('password', {
    required: 'Password is required.',
    validate: validatePassword,
  });

  const confirmPasswordRegister = register('confirmPassword', {
    required: 'Please confirm your password.',
    validate: (value: string) =>
      value === password || 'Passwords do not match.',
  });

  const onFormSubmit = useCallback(
    (event: React.BaseSyntheticEvent) => {
      handleSubmit(onSubmit)(event);
    },
    [handleSubmit, onSubmit],
  );

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 font-semibold text-red-500">
            Invalid or expired reset link.
          </p>

          <button
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 font-semibold text-green-600">{successMessage}</p>

          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg rounded-lg bg-white py-10 px-12 shadow-md">
        <h1 className="headline-lg mb-4">Create a New Password</h1>

        <p className="body-md mb-6 w-[90%] flex">
          Create a new, strong password to secure your workstation access.
        </p>

        <form onSubmit={onFormSubmit} className="space-y-6">
          <InputField
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            error={errors.password?.message?.toString()}
            {...passwordRegister}
            onChange={(e) => {
              passwordRegister.onChange(e);
              setPasswordValue(e.target.value);
            }}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message?.toString()}
            {...confirmPasswordRegister}
          />

          {/* Security Requirements*/}
          <div className="w-full mx-auto bg-[#f8f9ff] py-6 px-2 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              SECURITY REQUIREMENTS
            </h3>

            <div className="flex md:flex-row flex-col gap-3 md:gap-8 text-[--color-neutral-100]">
              {/* 1st col */}
              <div className="flex-1 space-y-3 body-md">
                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={hasLength} />
                  <span>8 - 64 characters</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={hasLowercase} />
                  <span>Lowercase letter</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={hasSpecialChar} />
                  <span>Special character</span>
                </label>
              </div>

              {/* 2nd col */}
              <div className="flex-1 space-y-3">
                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={hasUppercase} />
                  <span>Uppercase letter</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={hasNumber} />
                  <span>One digit</span>
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            name={isPending ? 'Resetting Password...' : 'Update Password'}
            disabled={isPending || Object.keys(errors).length > 0}
            isSubmitting={isPending}
            className="w-full"
          />

          <Link href="/login" className="text-[--primary] flex justify-center">
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
