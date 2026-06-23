// src/services/getProjectEpics.ts
// Call Only In --- Client Components ---

export const getProjectEpics = async ({ projectId }: { projectId: string }) => {
  const res = await fetch(`/api/get-project-epics?projectId=${projectId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch epics');
  }

  return data;
};

// Client Component
//       │
//       ▼
// getProjectEpics()
//       │
//       ▼
// /api/get-project-epics
//       │
//       ▼
// fetchProjectEpics()
//       │
//       ▼
// Supabase / Backend
