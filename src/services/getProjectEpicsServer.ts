// services/getProjectEpicsServer.ts

import { getAuthCookies } from '@/lib/auth';
import { fetchProjectEpics } from '@/lib/api/epics';

export const getProjectEpicsServer = async ({
  projectId,
}: {
  projectId: string;
}) => {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  return fetchProjectEpics({
    projectId,
    accessToken,
  });
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
