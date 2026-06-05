'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
// import * as icons from '../../../public/icons/icons';
import Input from '@/app/components/atoms/input';
import Button from '@/app/components/atoms/Button';
import { resetPassword } from '@/services/auth';
import Link from 'next/link';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  // const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [urlChecked, setUrlChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ResetPasswordFormData, boolean>>
  >({});

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // handle Security Requirements Checks
  const hasLength =
    formData.password.length >= 8 && formData.password.length <= 64;
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const token = params.get('access_token');
    const type = params.get('type');

    if (type === 'recovery' && token) {
      setAccessToken(token);
    }

    setUrlChecked(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const validateForm = (
    data: ResetPasswordFormData = formData,
  ): Partial<Record<keyof ResetPasswordFormData, string>> => {
    const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

    const password = String(data.password);

    if (!password) {
      newErrors.password = 'Password is required.';
    } else {
      const passwordErrors: string[] = [];

      if (password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }

      if (password.length > 64) {
        passwordErrors.push('maximum 64 characters');
      }

      if (/\s/.test(password)) {
        passwordErrors.push('no whitespace');
      }

      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('one uppercase letter');
      }

      if (!/[a-z]/.test(password)) {
        passwordErrors.push('one lowercase letter');
      }

      if (!/[0-9]/.test(password)) {
        passwordErrors.push('one digit');
      }

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
        passwordErrors.push('one special character');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain: ${passwordErrors.join(', ')}.`;
      }
    }

    const confirmPassword = String(data.confirmPassword);

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    } as ResetPasswordFormData;

    setFormData(updatedFormData);

    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const newErrors = validateForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!accessToken) return;

    setSubmitAttempted(true);

    const newErrors = validateForm();

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(accessToken, formData.password);

      setSuccessMessage(
        'Your password has been updated successfully. You can now log in.',
      );

      timeoutRef.current = setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);

      setErrors({
        password:
          'Failed to reset password. Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!urlChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your new password"
            error={
              (submitAttempted || touched.password) && errors.password
                ? errors.password
                : undefined
            }
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm your new password"
            error={
              (submitAttempted || touched.confirmPassword) &&
              errors.confirmPassword
                ? errors.confirmPassword
                : undefined
            }
          />

          {/* Security Requirements */}
          <div className='"max-w-md mx-auto bg-[#f8f9ff] p-6 rounded-2xl shadow-sm"'>
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              SECURITY REQUIREMENTS
            </h3>

            <div className='flex md:flex-row flex-col gap-6 md:gap-8 text-(--color-neutral-100)"'>
              {/* 1st col */}
              <div className="flex-1 space-y-3 body-md">
                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLength}
                    // className="accent-green-600"
                  />
                  <span>8 - 64 characters</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLowercase}
                    // className="accent-green-600"
                  />
                  <span>Lowercase letter</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSpecialChar}
                    // className="accent-green-600"
                  />
                  <span>Special character</span>
                </label>
              </div>

              {/* 2nd col */}
              <div className="flex-1 space-y-3">
                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasUppercase}
                    // className="accent-green-600"
                  />
                  <span>Uppercase letter</span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNumber}
                    // className="accent-green-600"
                  />
                  <span>One digit</span>
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            name={isSubmitting ? 'Resetting Password...' : 'Update Password'}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            isSubmitting={isSubmitting}
            className="w-full"
          />

          <Link href="/login" className="text-(--primary) flex justify-center">
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
