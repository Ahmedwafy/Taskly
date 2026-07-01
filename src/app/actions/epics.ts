// src/app/actions/epics.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { getAuthCookies } from '@/lib/auth';
import { UpdateEpicArgs } from '@/types/shared';

// ======================================================
// ::: Create New Epic
// ======================================================
interface CreateEpicInput {
  title: string;
  project_id: string;
  description?: string | null;
  assignee_id?: string | null;
  deadline?: string | null;
}
export async function createEpicAction(input: CreateEpicInput) {
  try {
    // 1. Grab server-side tokens
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // 2. Validate crucial runtime inputs
    if (!input.title?.trim()) {
      return { error: 'Title is required' };
    }
    if (!input.project_id?.trim()) {
      return { error: 'Project ID is required' };
    }

    // 3. Format and sanitize payload for PostgreSQL parsing rules
    const epicPayload = {
      title: input.title.trim(),
      project_id: input.project_id.trim(),
      description: input.description?.trim() || null,
      assignee_id: input.assignee_id?.trim() || null,
      deadline: input.deadline?.trim() ? input.deadline.trim() : null,
    };

    // 4. Dispatch fetch mutation directly upstream to Supabase cluster
    const response = await fetch(`${baseURL}${endPoints.createNewEpic}`, {
      method: 'POST',
      headers: {
        apiKey: supabaseKey, // Keeping your lowercase/uppercase header name matching your original endpoint file
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(epicPayload),
    });

    const responseText = await response.text();
    let result = null;

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        result = { message: responseText };
      }
    }

    if (!response.ok) {
      return {
        error:
          result?.message ||
          result?.error ||
          'Failed to create epic on database server.',
      };
    }

    // 5. Instantly clear cache across your layouts to render live updates
    revalidatePath(`/projects/${input.project_id}/epics`);

    return { success: true, data: result || { success: true } };
  } catch (error) {
    console.error('CRITICAL: Create Epic Action Crashed:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}

// ======================================================
// ::: Update Epic
// ======================================================
export async function updateEpicAction({ epicId, payload }: UpdateEpicArgs) {
  try {
    // 1. Grab server-side tokens
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    if (!epicId) {
      return { error: 'Missing Epic ID' };
    }

    // 2. Dispatch PATCH directly upstream to Supabase
    const response = await fetch(
      `${baseURL}${endPoints.epic.updateEpic(epicId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => 'Unknown database cluster error');
      return { error: `Failed to update epic: ${errorText}` };
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: true };

    // 3. Revalidate paths to drop stale caches instantly
    revalidatePath('/projects');

    return { success: true, data };
  } catch (error) {
    console.error('CRITICAL: Update Epic Action Crashed:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}
