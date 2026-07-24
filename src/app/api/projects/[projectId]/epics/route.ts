// app/api/projects/[projectId]/epics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectEpics } from '@/app/queries/epics';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;

    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const limit = Number(searchParams.get('limit') || 10);
    const offset = Number(searchParams.get('offset') || 0);
    const searchTerm = searchParams.get('searchTerm') || '';

    const result = await fetchProjectEpics({
      projectId,
      limit,
      offset,
      searchTerm,
      accessToken,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch epics',
      },
      { status: 500 },
    );
  }
}
