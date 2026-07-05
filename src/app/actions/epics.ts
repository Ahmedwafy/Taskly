// src → app → actions → epics.ts
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { getAuthCookies } from '@/lib/auth';
import { z } from 'zod';
import { CreateEpicSchema, UpdateEpicSchema } from '@/schemas/epic.schema';

// ======================================================
// ::: Create Epic Action :::
// ======================================================
export async function createEpicAction(
  input: z.input<typeof CreateEpicSchema>,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // Validate and automatically transform inputs using Zod
    const parsed = CreateEpicSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid form input.',
      };
    }

    // Destructure data cleanly. Everything here is already post-transform (sanitized & null-mapped)
    const { project_id } = parsed.data;
    const epicPayload = parsed.data;

    const response = await fetch(`${baseURL}${endPoints.createNewEpic}`, {
      method: 'POST',
      headers: {
        apiKey: supabaseKey,
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

    revalidatePath(`/projects/${project_id}/epics`);

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
// ::: Update Epic Action :::
// ======================================================
export async function updateEpicAction(
  input: z.input<typeof UpdateEpicSchema>,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // Structural runtime schema sanitization
    const parsed = UpdateEpicSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid update arguments.',
      };
    }

    const { epicId, projectId, payload } = parsed.data;

    // Transmit sanitized patch structural request directly upstream
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

    revalidatePath(`/projects/${projectId}/epics`);

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

// ======================================================
// ::: Get Epic Details Action :::
// ======================================================
interface GetEpicDetailsPayload {
  projectId: string;
  epicId: string;
}

export async function getEpicDetailsAction({
  projectId,
  epicId,
}: GetEpicDetailsPayload) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      throw new Error('Unauthorized. Please log in again.');
    }

    if (!projectId || !epicId) {
      throw new Error('Both Project ID and Epic ID are required.');
    }

    const response = await fetch(
      `${baseURL}${endPoints.project.epicDetails(projectId, epicId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        // Optional: Ensure it always grabs the latest data
        cache: 'no-store',
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          'Failed to fetch epic details from database.',
      );
    }

    // extracting the first item if return an array
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('CRITICAL: Get Epic Details Action Crashed:', error);
    throw error; // Let the client component's try/catch block handle the UI message
  }
}
