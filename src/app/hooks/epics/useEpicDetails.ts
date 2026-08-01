// app/hooks/epics/useEpicDetails.ts
import { useQuery } from '@tanstack/react-query';
import { EpicDetails } from '@/types/shared';

async function fetchEpicDetails(
  projectId: string,
  epicId: string,
): Promise<EpicDetails> {
  const response = await fetch(`/api/projects/${projectId}/epics/${epicId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch epic details');
  }

  return data as EpicDetails;
}

interface UseEpicDetailsParams {
  projectId: string;
  epicId: string | null;
  enabled: boolean;
}

export function useEpicDetails({
  projectId,
  epicId,
  enabled,
}: UseEpicDetailsParams) {
  return useQuery({
    queryKey: ['epicDetails', projectId, epicId],
    queryFn: () => fetchEpicDetails(projectId, epicId as string),
    enabled: enabled && !!epicId,
  });
}
