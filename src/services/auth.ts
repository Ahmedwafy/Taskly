// src/services/auth.ts

// Sign-Up
import {
  SignInPayload,
  SignUpPayload,
  ResetPasswordPayload,
} from '@/types/auth';
import {
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormTypes,
} from '@/types/shared';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { SignUpSchema, SignInSchema } from '../schemas/auth';

// Sign Up
export const signUp = async (formData: SignUpFormData) => {
  // Zod Validation
  const parsed = SignUpSchema.safeParse(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  const payload: SignUpPayload = {
    email: formData.email.trim(),
    password: formData.password,
    data: {
      name: formData.name.trim(),
      department: formData.department.trim(),
    },
  };

  const response = await fetch(`${baseURL}${endPoints.auth.signUp}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log('Supabase signup error:', data);
    throw new Error(
      data?.msg ||
        data?.error_description ||
        data?.error_code ||
        'Sign up failed',
    );
  }

  return data;
};

// ===========================================================

// Login
export const signIn = async (cleanedDataToSend: SignInFormData) => {
  const parsed = SignInSchema.safeParse(cleanedDataToSend);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const payload = parsed.data;

  // const payload: SignInPayload = {
  //   email: cleanedDataToSend.email.trim(),
  //   password: cleanedDataToSend.password.trim(),
  //   rememberMe: cleanedDataToSend.rememberMe,
  // };

  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log('Supabase error:', data);
    throw new Error(
      data?.msg ||
        data?.error_description ||
        data?.error_code ||
        'Login failed',
    );
  }

  return data;
};
// ===========================================================

// forgot Password Request
export const forgotPasswordRequest = async (
  cleanedDataToSend: ForgotPasswordFormTypes,
) => {
  const payload: ForgotPasswordFormTypes = {
    email: cleanedDataToSend.email.trim(),
  };

  const response = await fetch(`${baseURL}${endPoints.auth.forgotPasswod}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
};

// ===========================================================

// Reset Password
export const resetPassword = async (
  accessToken: string,
  newPassword: string,
) => {
  const payload: ResetPasswordPayload = {
    password: newPassword,
  };

  const response = await fetch(`${baseURL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to reset password');
  }

  return response.json();
};

// ===========================================================

// Sign out (server-side clears cookies)
export const signOut = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};
