'use client';

// This Helper Will Use It with any where need token
// export const getAccessToken = () =>
//   localStorage.getItem('access_token') ||
//   sessionStorage.getItem('access_token');
// const token = getAccessToken();

import { useState } from 'react';
import { signIn } from '@/services/auth';
import { SignInFormData } from '@/types/shared';
import Link from 'next/link';
import Input from '@/app/components/atoms/input';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/atoms/Button';
import Image from 'next/image';
import * as icons from '../../../public/icons/icons';

const LogInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignInFormData, boolean>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});
  const [authError, setAuthError] = useState<string>('');

  // handle remember me logic
  const [rememberMe, setRememberMe] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
    const updatedFormData = {
      ...formData,
      [name]: value,
    } as SignInFormData;

    setFormData(updatedFormData);

    // Validate the entire form in real-time to update button state
    const newErrors = handleValidation(updatedFormData);
    setErrors(newErrors);
  };

  // after click outside / unfocus fields
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement;
    setTouched((prev) => ({ ...(prev || {}), [name]: true }));

    // Re-validate on blur so user sees updated messages for that field
    const newErrors = handleValidation();
    setErrors(newErrors);
  };

  const handleValidation = (
    data: SignInFormData = formData,
  ): Partial<Record<keyof SignInFormData, string>> => {
    const newErrors: Partial<Record<keyof SignInFormData, string>> = {};

    // Email Validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const email = data.email.trim();
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    // Password Validation
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
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        passwordErrors.push('one special character');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain: ${passwordErrors.join(', ')}.`;
      }
    }

    // results: {} of Errors if Exist
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Mark that user attempted to submit so we display all errors
    setSubmitAttempted(true);

    setAuthError('');

    const newErrors = handleValidation();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    const cleanedDataToSend = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    try {
      const res = await signIn(cleanedDataToSend);

      const token = res?.access_token;
      const refreshToken = res?.refresh_token;
      if (!token || !refreshToken) {
        throw new Error('Missing auth tokens');
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');

      if (rememberMe) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        sessionStorage.setItem('access_token', token);
        sessionStorage.setItem('refresh_token', refreshToken);
      }

      setFormData({
        email: '',
        password: '',
      });
      setErrors({});
      router.push('/projects');
    } catch (error) {
      console.error('Error submitting data:', error);
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Unable to log in. Please check your credentials and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto my-auto px-8 py-10 rounded-lg shadow-lg bg-(--background) mt-16">
      <div className="flex flex-col text-center gap-2 items-center justify-center">
        <h2 className="headline-lg">Welcome Back</h2>
        <p className="body-md">
          Please enter your details to access your workspace
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          // htmlFor="email"
          name="email"
          label="EMAIL"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email || submitAttempted ? errors.email : undefined}
        />
        <Input
          // htmlFor="password"
          name="password"
          label="PASSWORD"
          type="password"
          placeholder="Enter your password"
          description="Must be at least 8 characters long."
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.password || submitAttempted ? errors.password : undefined
          }
        />
        {authError ? (
          <p className="text-sm text-red-500 py-2">{authError}</p>
        ) : null}

        <div className="flex justify-between py-6">
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="text-sm text-[#4F5F7B]">
              Remember Me
            </label>
          </div>
          <div>
            <Link href="/" className="font-smeibold">
              <span className="text-(--primary)">Forget Password ?</span>
            </Link>
          </div>
        </div>

        <Button
          name="Log In"
          type="submit"
          variant="primary"
          // className="" ... Add Special Style If Needed
        />
        <br />
        <hr className="text-gray-200" />

        <div className="mx-auto w-full flex gap-2 justify-center pt-8 pb-4">
          <span className="text-neutral-200">Don&apos;t have an account?</span>
          <a href="/sign-up" className="text-(--primary) hover:underline">
            <span className="font-semibold">Sign Up</span>
          </a>
        </div>
      </form>
    </div>
  );
};
export default LogInForm;
