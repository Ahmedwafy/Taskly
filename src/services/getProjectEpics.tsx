// src/services/getProjectEpics.ts
// Call Only In --- Client Components ---

// src/services/getProjectEpics.ts
import { ProjectEpic } from '@/types/shared';

interface GetProjectEpicsParams {
  projectId: string;
}

export interface ClientEpicsResponse {
  epics: ProjectEpic[];
  totalCount: number;
}

export const getProjectEpics = async ({
  projectId,
}: GetProjectEpicsParams): Promise<ClientEpicsResponse> => {
  const res = await fetch(`/api/get-project-epics?projectId=${projectId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch epics');
  }

  return data;
};
// Client Component
//       │
//       ▼  [Triggered on mount via useEffect]
// getProjectEpics({ projectId })
//       │
//       ▼  [Hits local Next.js Route]
// /api/get-project-epics?projectId=...
//       │
//       ▼  [Server fetches with Auth Token]
// fetchProjectEpics({ projectId, accessToken })
//       │
//       ▼
// Backend / Supabase
