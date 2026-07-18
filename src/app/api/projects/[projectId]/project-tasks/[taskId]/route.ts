// src > app > api > projects > [projectId] > project-tasks > [taskId] > route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchSingleTaskDetais, updateTaskStatus } from '@/app/queries/task';

// === GET: Fetch Single Task Details ===
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
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

// src > app > api > projects > [projectId] > project-tasks > [taskId] > route.ts
// === PATCH: Update Task Status ===
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
    const { taskId } = await params;
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 },
      );
    }

    const updatedTask = await updateTaskStatus({
      taskId,
      status,
      accessToken,
    });

    return NextResponse.json({ data: updatedTask });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
