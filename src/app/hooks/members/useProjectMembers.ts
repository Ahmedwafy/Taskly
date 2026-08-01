// app > hooks > members > useProjectMembers.ts

import { useQuery } from '@tanstack/react-query';
import { ProjectMember } from '@/types/shared';

async function fetchProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  const response = await fetch(`/api/projects/${projectId}/members`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch members');
  }

  return data as ProjectMember[];
}

export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ['members', projectId],
    queryFn: () => fetchProjectMembers(projectId as string),
    enabled: !!projectId,
  });
}

/* 
    The caching guard is gone — and that's intentional, not an oversight. Your thunk's condition function manually checked 
    "do I already have this project's members loaded, skip if so." useQuery does this automatically via its cache: 
    calling useProjectMembers(projectId) twice (from different components) reuses the same cached data under the same queryKey, 
    and by default won't refetch on remount within staleTime.
*/
