// src → app → actions → auth.ts
'use server';

import { cookies } from 'next/headers';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { SignUpSchema, SignInSchema } from '@/schemas/auth';
import { setAuthCookies } from '@/lib/auth';
import { COOKIE_KEYS } from '@/lib/auth-cookie-config';
import {
  SignUpFormData,
  SignInFormData,
  ForgotPasswordFormTypes,
} from '@/types/shared';

// ==========================================
// 1. SIGN UP
// ==========================================
export async function signUpAction(formData: SignUpFormData) {
  const parsed = SignUpSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const payload = {
    email: formData.email.trim(),
    password: formData.password,
    data: {
      name: formData.name.trim(),
      department: formData.department.trim(),
    },
  };

  try {
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
      return {
        error:
          data?.msg ||
          data?.error_description ||
          data?.error_code ||
          'Sign up failed',
      };
    }

    return { success: true, data };
  } catch (error) {
    return { error: 'An unexpected error occurred during registration.' };
  }
}

// ==========================================
// 2. SIGN IN (Replaces /api/login)
// ==========================================
export async function signInAction(formData: SignInFormData) {
  const parsed = SignInSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { email, password, rememberMe } = parsed.data;

  try {
    const response = await fetch(`${baseURL}${endPoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error:
          data?.error_description ||
          data?.error ||
          data?.msg ||
          'Invalid credentials.',
      };
    }

    // ✅ Securely store the auth tokens in HTTP-only cookies natively on the server
    await setAuthCookies(data.access_token, data.refresh_token, rememberMe);

    return { success: true, user: data.user };
  } catch (error) {
    return { error: 'An unexpected server error occurred during login.' };
  }
}

// ==========================================
// 3. FORGOT PASSWORD
// ==========================================
export async function forgotPasswordAction(formData: ForgotPasswordFormTypes) {
  const email = formData.email?.trim();

  if (!email) {
    return { error: 'Email address is required.' };
  }

  try {
    const response = await fetch(`${baseURL}${endPoints.auth.forgotPasswod}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Extract the response text first to safely inspect it
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      console.error('Supabase Forgot Password Error:', data);
      return {
        error:
          data?.msg ||
          data?.error_description ||
          'Unable to process password reset request.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Forgot password network exception:', error);
    return { error: 'A network error occurred. Please try again.' };
  }
}

// ==========================================
// 4. RESET PASSWORD
// ==========================================
export async function resetPasswordAction(newPassword: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return { error: 'Your password reset session has expired or is invalid.' };
  }

  try {
    const response = await fetch(`${baseURL}${endPoints.auth.resetPassword}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      return {
        error:
          data?.msg ||
          data?.error_description ||
          'Failed to update your password.',
      };
    }

    // SUCCESS: Clean up the recovery tokens from the browser so the session clears out
    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);

    return { success: true };
  } catch (error) {
    console.error('Password reset action crash:', error);
    return { error: 'A network error occurred. Please try again.' };
  }
}

// ==========================================
// 5. SIGN OUT (Replaces /api/logout)
// ==========================================
export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (accessToken) {
      // Notify Supabase to terminate the token session
      await fetch(`${baseURL}${endPoints.auth.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout background network request failed:', error);
  } finally {
    // Always clear the client's cookies, even if the external API fetch failed
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REMEMBER_ME);
  }

  return { success: true };
}
