'use client';

import Input from '@/app/components/atoms/Input';
import Button from '@/app/components/atoms/Button';
import { signUp } from '@/services/auth';
import { SignUpFormData } from '@/types/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SignUpForm = () => {
  const router = useRouter();
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      department: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordRegister = register('password', {
    required: 'Password is required.',
    minLength: { value: 8, message: 'Password must be at least 8 characters.' },
    maxLength: {
      value: 64,
      message: 'Password must be at most 64 characters.',
    },
    validate: (value) => {
      if (/\s/.test(value)) return 'Password must not contain whitespace.';
      if (!/[A-Z]/.test(value))
        return 'Password must contain an uppercase letter.';
      if (!/[a-z]/.test(value))
        return 'Password must contain a lowercase letter.';
      if (!/[0-9]/.test(value)) return 'Password must contain a digit.';
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return 'Password must contain a special character.';
      }
      return true;
    },
  });

  const confirmPasswordRegister = register('confirmPassword', {
    required: 'Please confirm your password.',
    validate: (value) =>
      value === getValues('password') || 'Passwords do not match.',
  });

  const hasLength = passwordValue.length >= 8 && passwordValue.length <= 64;
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasAllThree = hasLowercase && hasUppercase && hasNumber;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  const onSubmit = async (data: SignUpFormData) => {
    const dataToSend = {
      name: data.name.trim(),
      email: data.email.trim(),
      department: data.department.trim(),
      password: data.password,
    };

    try {
      await signUp(dataToSend);
      toast.success('Account created successfully');
      router.push('/login');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
      console.error('Error submitting sign-up form:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto max-w-xl px-4 py-8 mt-10 rounded-lg h-full shadow-md bg-background">
      <div className="flex flex-col md:justify-center gap-2 md:text-center w-full relative left-10 sm:left-0">
        <h2 className="headline-lg">Create your workspace</h2>
        <p className="body-md">
          Join the editorial approach to task management.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-[90%] h-full"
      >
        <Input
          id="name"
          label="NAME"
          type="text"
          placeholder="Enter your full name"
          description="3-50 characters, letters only."
          error={errors.name?.message?.toString()}
          {...register('name', {
            required: 'Name is required.',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters.',
            },
            maxLength: {
              value: 50,
              message: 'Name must be at most 50 characters.',
            },
          })}
        />

        <Input
          id="email"
          label="EMAIL"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message?.toString()}
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Enter a valid email address.',
            },
          })}
        />

        <Input
          {...register('department')}
          id="department"
          label="JOB TITLE (OPTIONAL)"
          type="text"
          placeholder="e.g. Project Manager"
          error={errors.department?.message?.toString()}
        />

        <div className="flex gap-4">
          <Input
            id="password"
            label="PASSWORD"
            type="password"
            placeholder="Password"
            className="w-1/2"
            error={errors.password?.message?.toString()}
            {...passwordRegister}
            onChange={(e) => {
              // if (passwordRegister.onChange) {
              //   passwordRegister.onChange(e);
              // }
              // or
              passwordRegister.onChange?.(e);
              setPasswordValue(e.target.value);
            }}
          />

          <Input
            id="confirmPassword"
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Repeat your password"
            className="w-1/2"
            error={errors.confirmPassword?.message?.toString()}
            {...confirmPasswordRegister}
          />
        </div>

        <div className="flex flex-col gap-2 bg-[#E8EDFF] p-4 rounded-md my-4">
          <div>
            <input
              type="checkbox"
              checked={hasLength}
              readOnly
              id="agree-length"
              className="mr-2"
            />
            <label htmlFor="agree-length" className="text-sm text-[#4F5F7B]">
              At least 8 characters
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={hasAllThree}
              readOnly
              id="agree-case"
              className="mr-2"
            />
            <label htmlFor="agree-case" className="text-sm text-[#4F5F7B]">
              One uppercase, lowercase, and digit
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={hasSpecialChar}
              readOnly
              id="agree-special"
              className="mr-2"
            />
            <label htmlFor="agree-special" className="text-sm text-[#4F5F7B]">
              One special character
            </label>
          </div>
        </div>

        <Button
          name="Create Account"
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-linear-to-r from-(--primary) to-(--primary-container) py-3 rounded-md hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center gap-2 transition-colors duration-300"
          isSubmitting={isSubmitting}
        />

        <p className="text-[#4F5F7B] body-md text-center py-4">
          Already have an account?
          <a
            href="/login"
            className="text-[#003D9B] hover:underline ml-2 font-bold"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
