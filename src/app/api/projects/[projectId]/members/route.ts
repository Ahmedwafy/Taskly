// src/app/api/projects/[projectId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth';
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  console.log('API HIT');
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in again.' },
      { status: 401 },
    );
  }

  try {
    const { projectId } = await params;
    console.log('projectId:', projectId);

    const response = await fetch(
      `${baseURL}${endPoints.projectMembers(projectId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseKey,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
