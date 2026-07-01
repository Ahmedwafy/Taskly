// src/app/api/projects/[projectId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectMembersList } from '@/app/queries/members'; // Clean Import!

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in again.' },
        { status: 401 },
      );
    }

    const { projectId } = await params;

    // Call our unified query function directly
    const data = await fetchProjectMembersList({
      projectId,
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
