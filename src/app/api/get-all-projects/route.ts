// Special Case :
// Created this route to use inside : ProjectsMobile.tsx as it is a 'use client' component so can not use : const result = await getAllProjects(...)
// But it's parent component is a server component : src/app/(pages)/projects/page.tsx → and can use const result = await getAllProjects(...)

import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '@/services/getAllProjects';
import { getAuthCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const limit = Number(searchParams.get('limit')) || 10;
    const offset = Number(searchParams.get('offset')) || 0;

    const result = await getAllProjects({
      accessToken,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}
