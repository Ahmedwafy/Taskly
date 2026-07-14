// src → app → actions → tasks.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { getAuthCookies } from '@/lib/auth';
import { CreateTaskSchema } from '@/schemas/createNewTask.schema';
import z from 'zod';

// ==============================================================
// ::: Create Task Action :::
// ==============================================================
export async function createTaskAction(
  input: z.input<typeof CreateTaskSchema>,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // Validate input using Zod Schema
    const parsed = CreateTaskSchema.safeParse(input);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid form input.',
      };
    }

    // Destructure project_id for cache clearing, payload is already sanitized
    const { project_id } = parsed.data;
    const taskPayload = parsed.data;

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

    // Purge the relevant pages so your layout shows the updated tasks instantly
    revalidatePath(`/projects/${project_id}/tasks`);

    return { success: true, data: responseData };
  } catch (error: unknown) {
    console.error('Task mutation crash error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}
