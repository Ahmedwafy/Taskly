// src/app/api/epics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';

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

    const response = await fetch(`${process.env.API_URL}/epics`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: result.message || 'Failed to create epic',
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error('Create Epic Error:', error);

    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  }
}
