// src/app/api/create-new-task/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { endPoints } from '@/lib/endpoints';
import { supabaseKey, baseURL } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 },
      );
    }

    if (!body.project_id) {
      return NextResponse.json(
        { message: 'Project ID is required' },
        { status: 400 },
      );
    }

    // Safety Check: Ensure the Task configuration endpoint exists
    if (!baseURL || !endPoints.project.createNewTask) {
      console.error(
        'Configuration Error: baseURL or endPoints.project.createNewTask is missing',
        { baseURL, endpoints: endPoints?.project },
      );
      return NextResponse.json(
        { message: 'Internal Server Configuration Error' },
        { status: 500 },
      );
    }

    const targetURL = `${baseURL}${endPoints.project.createNewTask}`;

    const response = await fetch(targetURL, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation', // Forces Supabase to return the newly created row object
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: responseData?.message || 'Failed to post to backend cluster',
        },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error: unknown) {
    console.error('Task API system crash:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
