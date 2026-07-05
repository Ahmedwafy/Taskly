// src → app → actions → projects.ts
'use server';

import { cookies } from 'next/headers';
import { COOKIE_KEYS } from '@/lib/auth-cookie-config';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import {
  CreateProjectSchema,
  ProjectsSchema,
  UpdateProjectSchema,
} from '@/schemas/project.schema';
import { getAuthCookies } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ======================================================
// ::: Get More Projects On Scroll ( Mobile View ) :::
// ======================================================
export async function loadMoreProjectsAction(limit: number, offset: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return { error: 'Unauthorized' };
  }

  try {
    const res = await fetch(
      `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return { error: data?.message || 'Failed to fetch more projects' };
    }

    const parsed = ProjectsSchema.safeParse(data);
    if (!parsed.success) {
      return { error: 'Invalid data format returned' };
    }

    return { success: true, projects: parsed.data };
  } catch (error) {
    console.error('Infinite scroll backend error:', error);
    return { error: 'Network error occurred.' };
  }
}

// ======================================================
// ::: Create New Project :::
// ======================================================
export async function createProjectAction(
  input: z.input<typeof CreateProjectSchema>,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // → Validate input using Zod Schema
    const parsed = CreateProjectSchema.safeParse(input);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid form input.',
      };
    }

    // 'projectPayload' is now perfectly sanitized and typed automatically by Zod
    const projectPayload = parsed.data;

    const response = await fetch(
      `${baseURL}${endPoints.userData.createNewProject}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(projectPayload),
      },
    );

    const responseText = await response.text();
    let data = null;
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse response JSON:', responseText, err);
      }
    }

    if (!response.ok) {
      return {
        error:
          data?.message ||
          data?.details ||
          data?.error_description ||
          data?.error ||
          data?.msg ||
          'Failed to create project.',
      };
    }

    // add any other paths that need to be re-validated after create a new project (anywhere that shows the list of projects)
    revalidatePath('/projects');
    //            ↓
    // 1. Purges the Cache (Instant)
    // 2. Forces a re-fetch of the GET projects list (Instant)

    const createdProject = Array.isArray(data)
      ? data[0]
      : data || { success: true };
    return { success: true, data: createdProject };
  } catch (error) {
    console.error('Failed to create project action error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}

// ======================================================
// ::: Update Project :::
// ======================================================
export async function updateProjectAction(
  input: z.input<typeof UpdateProjectSchema>,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // Validate incoming parameters using Zod Schema
    const parsed = UpdateProjectSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid form input.',
      };
    }

    // Extract perfectly sanitized values from the output pipeline
    const { projectId, name, description } = parsed.data;

    const response = await fetch(
      `${baseURL}${endPoints.updateProjectById(projectId)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { error: data?.message || 'Failed to update project' };
    }

    // Purge the path cache so everything renders live updates instantly
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);

    return { success: true, data };
  } catch (error) {
    console.error('Failed to update project action error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected server error occurred.',
    };
  }
}
