// src → app → api → get-epics-details → route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchEpicDetails } from '@/lib/api/epicsDetails';

export async function GET(req: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    const projectId = searchParams.get('projectId');
    const epicId = searchParams.get('epicId');

    if (!projectId || !epicId) {
      return NextResponse.json(
        { message: 'Both Project ID and Epic ID are required' },
        { status: 400 },
      );
    }

    const data = await fetchEpicDetails({
      projectId,
      epicId,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
