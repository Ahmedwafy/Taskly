'use client';

import { useState } from 'react';
import { SignInFormData } from '@/types/shared';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import Link from 'next/link';
import Button from '@/app/components/atoms/Button';
import InputField from '../atoms/input';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useSearchParams } from 'next/navigation';
import { useSignIn } from '@/app/hooks/auth/useSignIn';

const LogInForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo'); // for accepting invitation if user 401 Unauthorized ( need to login )

  const { mutate: signIn, isPending, isError, error } = useSignIn(redirectTo);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: SignInFormData) => {
    signIn({
      email: data.email,
      password: data.password,
      rememberMe,
    });
  };

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const passwordValidator = (password: string) => {
    if (!password) return 'Password is required.';
    const pw = String(password);
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (pw.length > 64) return 'Password must be at most 64 characters.';
    if (/\s/.test(pw)) return 'Password must not contain whitespace.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain a digit.';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pw))
      return 'Password must contain a special character.';
    return true;
  };

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop Layout ●──────────────────────────● */}
      {!isMobile && (
        <div className="flex flex-col gap-6 max-w-120 h-146.5 mx-auto my-auto px-8 py-10 rounded-lg shadow-lg bg-background mt-16">
          <div className="flex flex-col text-center gap-2 items-center justify-center">
            <h2 className="headline-lg">Welcome Back</h2>
            <p className="body-md">
              Please enter your details to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: emailRegex,
                  message: 'Enter a valid email address.',
                },
              })}
              label="email"
              type="email"
              placeholder="Enter your Email"
              error={errors.email?.message}
              className="mb-6"
            />

            <InputField
              {...register('password', {
                validate: passwordValidator,
              })}
              variant="password"
              label="PASSWORD"
              type="password"
              placeholder="Enter your password"
              description="Must be at least 8 characters long."
              error={errors.password?.message}
            />

            {isError ? (
              <p className="text-sm text-red-500 py-2">{error.message}</p>
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
                <Link href="/forgot-password" className="font-smeibold">
                  <span className="text-(--primary)">Forget Password ?</span>
                </Link>
              </div>
            </div>

            <Button
              name={isPending ? 'Logging in...' : 'Log In'}
              type="submit"
              variant="primary"
              disabled={isPending}
            />
            <br />
            <hr className="text-gray-200" />

            <div className="mx-auto w-full flex gap-2 justify-center pt-8 pb-4">
              <span className="text-neutral-200">
                Don&apos;t have an account?
              </span>
              <a href="/sign-up" className="text-(--primary) hover:underline">
                <span className="font-semibold">Sign Up</span>
              </a>
            </div>
          </form>

          <DevTool control={control} />
        </div>
      )}

      {/* ●──────────────────────────● Mobile Layout ●──────────────────────────● */}
      {isMobile && (
        <div className="flex flex-col gap-6 max-w-120 mx-auto my-auto px-8 py-10 rounded-lg bg-background mt-16">
          <div className="flex flex-col text-center gap-2 items-center justify-center">
            <h2 className="headline-lg">Welcome Back</h2>
            <p className="body-md">
              Please enter your details to access your workspace
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative"
          >
            <div className="flex flex-col gap-6">
              <InputField
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: emailRegex,
                    message: 'Enter a valid email address.',
                  },
                })}
                label="EMAIL"
                type="email"
                placeholder="Enter your Email"
                error={errors.email?.message}
              />

              <Link
                href="/forgot-password"
                className="font-bold absolute right-0 top-22 text-sm mb-1"
              >
                <span className="text-(--primary)">Forget ?</span>
              </Link>

              <InputField
                {...register('password', {
                  validate: passwordValidator,
                })}
                variant="password"
                label="PASSWORD"
                type="password"
                placeholder="Enter your password"
                description="Must be at least 8 characters long."
                error={errors.password?.message}
              />
            </div>

            {isError ? (
              <p className="text-sm text-red-500 py-2">{error.message}</p>
            ) : null}

            {/* === Remember Me === */}
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
            </div>

            <Button
              name={isPending ? 'Logging in...' : 'Log In'}
              type="submit"
              variant="primary"
              disabled={isPending}
            />

            <br />
            <hr className="text-gray-200" />

            <div className="mx-auto w-full flex gap-2 justify-center pt-10 pb-4">
              <span className="text-neutral-200">
                Don&apos;t have an account?
              </span>
              <a href="/sign-up" className="text-(--primary) hover:underline">
                <span className="font-semibold">Sign Up</span>
              </a>
            </div>
          </form>

          <DevTool control={control} />
        </div>
      )}
    </>
  );
};

export default LogInForm;
