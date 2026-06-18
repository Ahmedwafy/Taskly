// src/services/update-project.ts

interface UpdateProjectPayload {
  name: string;
  description?: string;
}

export const updateProject = async (
  projectId: string,
  data: UpdateProjectPayload,
) => {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Failed to update project');
  }

  return result;
};
