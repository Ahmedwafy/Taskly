// src/app/api/refresh-token/route.ts

import { NextResponse } from 'next/server';
import { endPoints } from '@/lib/endpoints';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { getAuthCookies, setAuthCookies } from '@/lib/auth';
import { cookies } from 'next/headers';

// Generate New Access-Token Using Refresh-Token
export async function POST() {
  try {
    // Get rememberMe from cookies store
    const cookieStore = await cookies();
    const rememberMe = cookieStore.get('remember_me')?.value === '1';

    // Get Refresh-Token
    const { refreshToken } = await getAuthCookies();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${baseURL}${endPoints.auth.generateNewToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error_description || 'Unable to refresh token',
        },
        {
          status: response.status,
        },
      );
    }

    //  Stores the (access-Token & refresh-Token & rememberMe ) in secure HTTP-only cookies.
    await setAuthCookies(data.access_token, data.refresh_token, rememberMe);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Refresh token route error:', error);

    return NextResponse.json(
      {
        error: 'Something went wrong.',
      },
      {
        status: 500,
      },
    );
  }
}
