// src > app > api > projects > [projectId] > project-tasks > [taskId] > route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { fetchSingleTaskDetais, updateTaskDetails } from '@/app/queries/task';
// import { updateTaskDetails } from '@/app/queries/tasks';

// ===================================================
//  GET: Fetch Single Task Details
// ===================================================

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
// ===================================================
//  PATCH: General Dynamic Task Update (Status, Title, Assignee, etc.)
// ===================================================
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

    const payload = await req.json();

    // Ensure there is at least one field provided to update
    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: 'No update payload provided' },
        { status: 400 },
      );
    }

    const updatedTask = await updateTaskDetails({
      taskId,
      payload,
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
