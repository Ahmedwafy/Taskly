// src/app/api/create-epic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { endPoints } from '@/lib/endpoints';
import { supabaseKey, baseURL } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 },
      );
    }

    // Safety Check: Ensure backend configuration exists
    if (!baseURL || !endPoints.createNewEpic) {
      console.error(
        'Configuration Error: baseURL or endPoints.createNewEpic is missing',
        { baseURL, endPoints },
      );
      return NextResponse.json(
        { message: 'Internal Server Configuration Error' },
        { status: 500 },
      );
    }

    const targetURL = `${baseURL}${endPoints.createNewEpic}`;

    const response = await fetch(targetURL, {
      method: 'POST',
      headers: {
        apiKey: supabaseKey || '',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // SAFE PARSING: Read as text first to avoid crashing on non-JSON or empty responses
    const responseText = await response.text();
    let result = null;

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn('Backend response was not valid JSON:', responseText);
        result = { message: responseText };
      }
    }

    // Handle bad response codes from the upstream backend
    if (!response.ok) {
      console.error('Upstream backend error details:', {
        status: response.status,
        url: targetURL,
        payload: result,
      });

      return NextResponse.json(
        {
          message:
            result?.message ||
            result?.error ||
            'Failed to create epic on database server',
        },
        {
          status: response.status,
        },
      );
    }

    // If result is empty but status was ok (e.g. 201/204 with empty body)
    return NextResponse.json(result || { success: true }, {
      status: response.status || 201,
    });
  } catch (error: any) {
    // This highlights exactly what broke in your terminal logs!
    console.error('CRITICAL: Create Epic Route Crashed:', {
      message: error?.message,
      stack: error?.stack,
    });

    return NextResponse.json(
      {
        message: 'Internal Server Error',
        details: error?.message || 'Unknown exception',
      },
      {
        status: 500,
      },
    );
  }
}
