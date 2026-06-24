// services/getProjectEpicsServer.ts

import { getAuthCookies } from '@/lib/auth';
import { fetchProjectEpics } from '@/lib/api/epics';

export const getProjectEpicsServer = async ({
  projectId,
  page,
  limit,
}: {
  projectId: string;
  page?: number;
  limit?: number;
}) => {
  const { accessToken } = await getAuthCookies();
  if (!accessToken) throw new Error('Unauthorized');

  return fetchProjectEpics({ projectId, accessToken, page, limit });
};

// Server Component
//       │
//       ▼
// getProjectEpicsServer()
//       │
//       ▼
// fetchProjectEpics()
//       │
//       ▼
// Supabase / Backend
