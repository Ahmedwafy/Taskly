// src/services/getProjectMembers.ts

export const getProjectMembers = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}/members`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('API ERROR:', data);
    throw new Error(data?.error || 'Failed to fetch members');
  }

  return data;
};
