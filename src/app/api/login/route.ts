// src/app/api/login/route.ts
// proxy endpoint

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const response = await fetch(`${baseURL}${endPoints.auth.loginUser}`, {
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

    const cookieStore = await cookies();
    const accessTokenMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60;

    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: accessTokenMaxAge,
    });

    cookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

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
