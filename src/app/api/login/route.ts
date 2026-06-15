// src/app/api/login/route.ts
// proxy endpoint

import { NextResponse } from 'next/server';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { SignInSchema } from '../../../schemas/auth';
import { setAuthCookies } from '@/lib/auth';

// Login
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message,
        },
        {
          status: 400,
        },
      );
    }

    const { email, password, rememberMe } = parsed.data;

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
      return NextResponse.json(
        {
          error:
            data?.error_description ||
            data?.error ||
            data?.msg ||
            'Invalid credentials.',
        },
        { status: response.status || 401 },
      );
    }

    //  Stores the (access-Token & refresh-Token & rememberMe ) in secure HTTP-only cookies.
    await setAuthCookies(data.access_token, data.refresh_token, rememberMe);

    return NextResponse.json({
      user: data.user,
    });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
