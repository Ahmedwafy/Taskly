// src > app > api > statistics > calendar > route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { getTasksCalendarStats } from '@/app/queries/statistics';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in again.' },
        { status: 401 },
      );
    }

    const body = await request.json();

    const data = await getTasksCalendarStats({
      accessToken,
      ...body,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
