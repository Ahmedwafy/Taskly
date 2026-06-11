// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function POST() {
//   try {
//     const cookieStore = await cookies();

//     // Delete access and refresh tokens by expiring them
//     cookieStore.delete('access_token', { path: '/' });
//     cookieStore.delete('refresh_token', { path: '/' });

//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Logout route error:', error);
//     return NextResponse.json({ ok: false }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

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

    // then clear cookies
    cookieStore.delete({ name: 'access_token', path: '/' });
    cookieStore.delete({ name: 'refresh_token', path: '/' });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Logout route error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
