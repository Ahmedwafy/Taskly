// src > app > api > statistics > per-project > route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { getTasksPerProject } from '@/app/queries/statistics';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in again.' },
        { status: 401 },
      );
    }

    const { startDate, endDate } = await request.json();

    const data = await getTasksPerProject({
      accessToken,
      startDate,
      endDate,
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
