// src/app/api/projects/[projectId]/project-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectTasks } from '@/app/queries/projects';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    // Always await path params on the very first line
    const { projectId } = await params;

    // Proceed with token verification
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract the search query parameters
    const { searchParams } = new URL(req.url);
    const taskStatus = searchParams.get('status');

    if (!taskStatus) {
      return NextResponse.json(
        { error: 'Status parameter is required' },
        { status: 400 },
      );
    }

    const data = await fetchProjectTasks({
      projectId,
      taskStatus,
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
  // } catch (error: any) {
  //   // This will log the EXACT error message to  terminal console
  //   console.error('API ROUTE FAILURE:', error.message);
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
}
