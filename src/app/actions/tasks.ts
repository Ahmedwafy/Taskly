// src/app/actions/tasks.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { getAuthCookies } from '@/lib/auth';

interface CreateTaskInput {
  title: string;
  project_id: string;
  epic_id?: string | null;
  description?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  status?: string;
}

export async function createTaskAction(input: CreateTaskInput) {
  try {
    // 1. Authenticate the server request environment
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // 2. Validate essential fields
    if (!input.title?.trim()) {
      return { error: 'Title is required' };
    }
    if (!input.project_id) {
      return { error: 'Project ID is required' };
    }

    // 3. Normalize raw data properties for PostgreSQL handling
    const taskPayload = {
      title: input.title.trim(),
      project_id: input.project_id,
      assignee_id: input.assignee_id || null,
      epic_id: input.epic_id || null,
      description: input.description?.trim() || null,
      due_date: input.due_date || null,
      status: input.status || 'TO_DO',
    };

    // 4. Fire the POST request straight to Supabase
    const response = await fetch(
      `${baseURL}${endPoints.project.createNewTask}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(taskPayload),
      },
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error:
          responseData?.message ||
          'Failed to create task item in database cluster.',
      };
    }

    // 5. Purge the relevant pages so your layout shows the updated tasks instantly
    revalidatePath(`/projects/${input.project_id}`);
    revalidatePath(`/projects/${input.project_id}/tasks`);

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Task mutation crash error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}
