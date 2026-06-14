'use client';
import * as icons from '../../../../public/icons/icons';
import Button from '@/app/components/atoms/Button';
import Input from '@/app/components/atoms/input';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ForgotPasswordFormTypes } from '@/types/shared';
import { forgotPasswordRequest } from '@/services/auth';

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormTypes>({
    defaultValues: {
      email: '',
    },
  });

  const [countdown, setCountdown] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    if (minutes > 0) {
      return remainder === 0
        ? `${minutes}m`
        : `${minutes}m ${String(remainder).padStart(2, '0')}s`;
    }

    return `${remainder}s`;
  };

  const handleResend = async () => {
    setCountdown(300);
  };

  const onSubmit = async (data: ForgotPasswordFormTypes) => {
    try {
      await forgotPasswordRequest({ email: data.email.trim() });
      setCountdown(300);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSubmitted(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background w-md py-4 px-4 rounded-2xl mx-auto mt-14 shadow-md"
    >
      <div className="w-91.5 flex flex-col justify-center mx-auto py-8">
        <div className="flex flex-col gap-2">
          <h1 className="headline-lg">Forgot password?</h1>
          <p className="body-md">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <Input
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Enter a valid email address.',
              },
            })}
            name="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
          />

          <Button
            name="Send Reset Link"
            variant="primary"
            type="submit"
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
          />
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 justify-center py-6"
        >
          <Image src={icons.Arrow} alt="arrow" width={16} height={16} />
          <p className="text-[#003D9B]">Back to log in</p>
        </Link>

        <div>
          {isSubmitted && (
            <p className="flex justify-center py-4 my-4 bg-success text-[#005235] gap-2 rounded-md">
              <Image src={icons.Success} alt="Success" />
              <span>Your request has been sent successfully</span>
            </p>
          )}
        </div>

        <p className="label-sm flex justify-center text-[#434654]">
          DIDN&apos;T RECEIVE THE EMAIL?
        </p>

        <button
          onClick={handleResend}
          disabled={countdown > 0}
          className="disabled:opacity-50 w-full mb-2 mt-4"
          type="button"
        >
          <strong className="flex gap-2 justify-center bg-surface-highest rounded-sm py-4 text-[#737685]">
            <Image src={icons.Timer} alt="timer" />
            {countdown > 0
              ? `Resend in ${formatCountdown(countdown)}`
              : 'Resend'}
          </strong>
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
