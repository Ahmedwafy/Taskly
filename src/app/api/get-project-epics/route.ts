// app/api/get-project-epics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectEpics } from '@/lib/api/epics';

export async function GET(req: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { message: 'Project ID is required' },
        { status: 400 },
      );
    }

    const data = await fetchProjectEpics({
      projectId,
      accessToken,
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
