// src/app/api/get-all-projects/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { getAuthCookies } from '@/lib/auth';
// import { baseURL, supabaseKey } from '@/lib/supabase';
// import { endPoints } from '@/lib/endpoints';

// export async function GET(req: NextRequest) {
//   try {
//     const { accessToken } = await getAuthCookies();

//     if (!accessToken) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     const searchParams = req.nextUrl.searchParams;

//     const limit = Number(searchParams.get('limit')) || 10;
//     const offset = Number(searchParams.get('offset')) || 0;

//     const res = await fetch(
//       `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
//       {
//         headers: {
//           apikey: supabaseKey,
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );

//     const data = await res.json();

//     return NextResponse.json(data, {
//       status: res.status,
//     });
//   } catch (err) {
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// src/app/api/get-all-projects/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { getAuthCookies } from '@/lib/auth';
import { fetchProjects } from '@/lib/api/projects';

export async function GET(req: NextRequest) {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    const limit = Number(searchParams.get('limit')) || 10;
    const offset = Number(searchParams.get('offset')) || 0;

    const data = await fetchProjects({
      limit,
      offset,
      accessToken,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  }
}
