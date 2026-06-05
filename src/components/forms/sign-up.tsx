'use client';
import Input from '@/app/components/atoms/input';
import { signUp } from '@/services/auth';
import { SignUpFormData } from '@/types/shared';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/atoms/Button';

const SignUpForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpFormData, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  // handle Security Requirements Checks
  const hasLength =
    formData.password.length >= 8 && formData.password.length <= 64;
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasAllThree = hasLowercase && hasUppercase && hasNumber;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    } as SignUpFormData;

    setFormData(updatedFormData);

    // Validate the entire form in real-time to update button state
    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };

  // after click outside / unfocus fields
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement;
    setTouched((prev) => ({ ...(prev || {}), [name]: true }));

    // Re-validate on blur so user sees updated messages for that field
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const validateForm = (
    data: SignUpFormData = formData, // the argumet "data" now has a default value = formData
  ): Partial<Record<keyof SignUpFormData, string>> => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    // Name Validation
    const name = data.name.trim();
    const nameRegex = /^(?!.*\s{2,})[\p{L}]+(?:\s[\p{L}]+)*$/u;
    if (!data.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    } else if (name.length > 50) {
      newErrors.name = 'Name must be no more than 50 characters.';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name can only contain letters and single spaces.';
    }

    // Email Validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const email = data.email.trim();
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    // Job Title is optional, so can skip validation

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

    // Confirm Password Validation
    const confirmPassword = String(data.confirmPassword);
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // results: {} of Errors if Exist
    return newErrors;
  };

  // const isFormValid = Object.keys(validateForm()).length === 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Mark that user attempted to submit so we display all errors
    setSubmitAttempted(true);

    // Validate on submit and show errors if any —> block submission
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    const dataToSend = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      password: formData.password,
    };

    console.log('Form data to send:', dataToSend);

    try {
      await signUp(dataToSend);

      // Reset Data .. Clear Inputs
      setFormData({
        name: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setIsSubmitting(false);
      router.push('/login');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const agreeToTerms = [
    'At least 8 characters',
    'One uppercase, lowercase, and digit',
    'One special character',
  ];

  return (
    <div className="flex flex-col gap-4 justify-center items-center mx-auto max-w-xl px-4 py-8 mt-10 rounded-lg h-full shadow-md bg-(--background)">
      {/* Form Header */}
      <div className="flex flex-col md:justify-center gap-2 md:text-center w-full relative left-10 sm:left-0">
        <h2 className="headline-lg">Create your workspace</h2>
        <p className="body-md">
          Join the editorial approach to task management.
        </p>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-[90%] h-full"
      >
        {/* {submitAttempted && Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 p-3 rounded"
          >
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc ml-5 text-sm mt-1">
              {Object.entries(errors).map(([key, val]) =>
                val ? <li key={key}>{val}</li> : null,
              )}
            </ul>
          </div>
        )} */}
        <Input
          name="name"
          label="NAME"
          type="text"
          placeholder="Enter your full name"
          description="3-50 characters, letters only."
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name || submitAttempted ? errors.name : undefined}
        />
        <Input
          name="email"
          label="EMAIL"
          type="email"
          placeholder="yourname@company.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email || submitAttempted ? errors.email : undefined}
        />
        <Input
          name="jobTitle"
          label="JOB TITLE (OPTIONAL)"
          type="text"
          placeholder="e.g. Project Manager"
          value={formData.department}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="flex gap-4">
          <Input
            name="password"
            label="PASSWORD"
            type="password"
            placeholder="Password"
            className="w-1/2"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.password || submitAttempted ? errors.password : undefined
            }
          />
          <Input
            name="confirmPassword"
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Repeat your password"
            className="w-1/2"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.confirmPassword || submitAttempted
                ? errors.confirmPassword
                : undefined
            }
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex flex-col gap-2 bg-[#E8EDFF] p-4 rounded-md my-4">
          <div>
            <input
              type="checkbox"
              checked={hasLength}
              id="agree"
              name="agree"
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm text-[#4F5F7B]">
              {agreeToTerms[0]}
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={hasAllThree}
              id="agree"
              name="agree"
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm text-[#4F5F7B]">
              {agreeToTerms[1]}
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={hasSpecialChar}
              id="agree"
              name="agree"
              className="mr-2"
            />
            <label htmlFor="agree" className="text-sm text-[#4F5F7B]">
              {agreeToTerms[2]}
            </label>
          </div>
        </div>

        <Button
          name="Create Account"
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-linear-to-r from-(--primary) to-(--primary-container) py-3 rounded-md hover:cursor-pointer disabled:cursor-not-allowed 
          disabled:opacity-50 flex justify-center items-center gap-2 transition-colors duration-300"
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
