// app/hooks/epics/useProjectEpicsSelect.ts
import { useQuery } from '@tanstack/react-query';
import { ProjectEpic } from '@/types/shared';

interface UseProjectEpicsSelectParams {
  projectId: string | undefined;
  limit?: number;
}

interface EpicsSelectResponse {
  projectEpics: ProjectEpic[];
  totalCount: number;
}

async function fetchEpicsForSelect(
  projectId: string,
  limit: number,
): Promise<EpicsSelectResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: '0',
  });

  const response = await fetch(`/api/projects/${projectId}/epics?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch epics');
  }

  return data;
}

export function useProjectEpicsSelect({
  projectId,
  limit = 10,
}: UseProjectEpicsSelectParams) {
  return useQuery({
    queryKey: ['epics', projectId, 'select', limit],
    queryFn: () => fetchEpicsForSelect(projectId as string, limit),
    enabled: !!projectId,
  });
}
