// src > app > api > projects > [projectId] > project-tasks > route.ts
// --------------------------
// GET Proiect Tasks Route Handler
// --------------------------
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectTasks } from '@/app/queries/projects';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;

    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskStatus = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : undefined;
    const offset = searchParams.get('offset')
      ? Number(searchParams.get('offset'))
      : undefined;

    const title = searchParams.get('title') || undefined;

    const { data, total } = await fetchProjectTasks({
      projectId,
      taskStatus,
      accessToken,
      limit,
      offset,
      title,
    });

    // Expose both the paginated list and the exact total count
    return NextResponse.json({ data, total }); // Client gets: { data: [...], total: 120 }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
