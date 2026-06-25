// src → app → api → updateEpic → route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getAuthCookies } from '@/lib/auth';

import { UpdateEpicArgs } from '@/types/shared';
import { fetchUpdateEpic } from '@/lib/api/updateEpic';

export async function PATCH(request: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const epicId = searchParams.get('epicId');

    // Explicitly type the incoming body matching your shared types payload interface
    const payload: UpdateEpicArgs['payload'] = await request.json();

    if (!epicId) {
      return NextResponse.json({ message: 'Missing Epic ID' }, { status: 400 });
    }

    const data = await fetchUpdateEpic({ epicId, payload });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    // Change from any to unknown
    // Safe standard runtime validation checking for Error instances
    const errorMessage =
      error instanceof Error // This type guard checks if the error object actually contains a .message
        ? error.message
        : 'Internal server error while updating epic.';

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
