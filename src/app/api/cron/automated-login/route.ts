// src/app/api/cron/automated-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signInAction } from '@/app/actions/auth'; // Ensure this path matches where your action lives

export async function POST(req: NextRequest) {
  try {
    // 1. Verify cron-job.org is authorized via the header secret
    const authHeader = req.headers.get('Authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized request.' },
        { status: 401 },
      );
    }

    // 2. Extract worker credentials from your server environment variables
    const email = process.env.AUTOMATED_USER_EMAIL;
    const password = process.env.AUTOMATED_USER_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Server misconfiguration: missing credentials.' },
        { status: 500 },
      );
    }

    // 3. Directly trigger your server action
    const result = await signInAction({
      email,
      password,
      rememberMe: true, // Keep it extended
    });

    if (result?.error) {
      return NextResponse.json(
        { error: 'Authentication failed', details: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Automated login executed and cookies set.',
    });
  } catch (error) {
    console.error('CRON ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
