import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (accessToken) {
      await fetch(`${baseURL}${endPoints.auth.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // clear cookies
    await clearAuthCookies();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Logout route error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
