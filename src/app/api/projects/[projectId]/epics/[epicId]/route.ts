// src → app → api → projects → [projectId] → epics → [epicId] → route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchEpicDetailsList } from '@/app/queries/epics';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; epicId: string }> },
) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in again.' },
        { status: 401 },
      );
    }

    const { projectId, epicId } = await params;

    const data = await fetchEpicDetailsList({
      projectId,
      epicId,
      accessToken,
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
