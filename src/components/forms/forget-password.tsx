'use client';
import * as icons from '../../../public/icons/icons';
import Button from '@/app/components/atoms/Button';
import Input from '@/app/components/atoms/input';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ForgotPasswordFormTypes } from '@/types/shared';
import { forgotPasswordRequest } from '@/services/auth';

const ForgotPasswordForm = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormTypes>({
    email: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordFormTypes, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ForgotPasswordFormTypes, boolean>>
  >({});

  const [countdown, setCountdown] = useState(0);

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

  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    } as ForgotPasswordFormTypes;

    setFormData(updatedFormData);

    // Validate the entire form in real-time to update button state & error messages
    const newErrors = handleValidation(updatedFormData);
    setErrors(newErrors);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const newErrors = handleValidation(formData);
    setErrors(newErrors);
  };

  // TODO:
  const handleResend = async () => {
    // TODO: call resend endpoint here
    setCountdown(300);
  };

  const handleValidation = (
    data: ForgotPasswordFormTypes = formData,
  ): Partial<Record<keyof ForgotPasswordFormTypes, string>> => {
    const newErrors: Partial<Record<keyof ForgotPasswordFormTypes, string>> =
      {};

    // Email Validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const email = data.email.trim();
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    // results: {} of Errors if Exist
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate on submit and show errors if any —> block submission
    const newErrors = handleValidation();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitted(false);
      return;
    }

    // Cleaned Data to Send
    const cleanedDataToSend = {
      email: formData.email.trim(),
    };

    console.log('cleaned Data To Send', cleanedDataToSend);

    try {
      setIsLoading(true);
      await forgotPasswordRequest(cleanedDataToSend);
      setCountdown(300);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSubmitted(false);
    } finally {
      // Reset Data .. Clear Inputs
      setFormData({
        email: '',
      });
      setErrors({});
      setIsLoading(false);
      // router.push('/');
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--background) w-md py-4 px-4 rounded-2xl mx-auto mt-14 shadow-md"
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
            name="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            // error={errors.email}
            error={touched && errors.email ? errors.email : undefined}
          />

          <Button
            name="Send Reset Link"
            variant="primary"
            type="submit"
            isSubmitting={isloading}
            disabled={isloading}
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
            <p className="flex justify-center py-4 my-4 bg-(--success) text-[#005235] gap-2 rounded-md">
              <Image src={icons.Success} alt="Success" />
              <p>Your request has been sent successfully</p>
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
        >
          <strong className="flex gap-2 justify-center bg-(--surface-highest) rounded-sm py-4 text-[#737685]">
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
