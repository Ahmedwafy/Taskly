// GET Task Details route handler
// src > app > api > projects > [projectId] > project-tasks > [taskId] > route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchSingleTaskDetais } from '@/app/queries/task';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
    // Extract From URL
    const { projectId, taskId } = await params;

    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await fetchSingleTaskDetais({
      projectId,
      taskId,
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
