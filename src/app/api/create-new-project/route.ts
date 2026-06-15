//src/app/api/create-new-project/route.ts
import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { CreateProjectSchema } from '@/schemas/createProject.schema';
import { getAuthCookies } from '@/lib/auth';

// Create New Project
export async function POST(req: Request) {
  const { accessToken } = await getAuthCookies();

  // If There is no Access-Token in the Cookies
  if (!accessToken) {
    console.error('No access token found in cookies');
    return NextResponse.json(
      { error: 'Unauthorized. Please log in again.' },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    // Zod Validation
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message,
        },
        {
          status: 400,
        },
      );
    }

    const { name, description } = parsed.data;

    const projectPayload = {
      name,
      description: description ?? '',
    };

    const response = await fetch(
      `${baseURL}${endPoints.userData.createNewProject}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
          Prefer: 'return=representation', // Requests Supabase to return the created record details
        },
        body: JSON.stringify(projectPayload),
      },
    );

    // Safely extract text body first to prevent JSON parse errors on empty or non-JSON responses
    const responseText = await response.text();
    let data = null;
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error(
          'Failed to parse Supabase response as JSON:',
          responseText,
          err,
        );
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            data?.error_description ||
            data?.error ||
            data?.msg ||
            'Failed to create project.',
        },
        { status: response.status || 400 },
      );
    }

    // Success: return the created project (extract first element if returned as array representation)
    const createdProject = Array.isArray(data)
      ? data[0]
      : data || { success: true };
    return NextResponse.json(createdProject, {
      status: response.status,
    });
  } catch (error) {
    console.error('Failed to create project:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// Client
//  ↓
// /api/create-new-project
//  ↓
// Supabase
//  ↓
// 401 (expired token)
//  ↓
// Client receives 401
//  ↓
// /api/refresh-token
//  ↓
// new tokens
//  ↓
// retry create-new-project
