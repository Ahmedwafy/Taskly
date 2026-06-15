import { fetchWithRefresh } from '@/lib/fetchWithRefresh';

// src/services/create-new-project.ts
interface AddProjectDataTypes {
  name: string;
  description?: string;
}

// Create / Add New Project

export const createNewProject = async (data: AddProjectDataTypes) => {
  const payload: AddProjectDataTypes = {
    name: data.name.trim(),
    description: data.description?.trim(),
  };

  const response = await fetchWithRefresh(`/api/create-new-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Safely extract text body first to prevent JSON parse errors on empty or non-JSON responses
  const responseText = await response.text();

  let res = null;
  if (responseText) {
    try {
      res = JSON.parse(responseText);
    } catch (err) {
      console.error('Failed to parse API response as JSON:', responseText, err);
    }
  }

  if (!response.ok) {
    console.error('Project creation error:', {
      status: response.status,
      error: res,
    });

    throw new Error(res?.error || 'Failed to create project');
  }

  return res;
};
