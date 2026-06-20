// src/services/createEpics.ts

export interface CreateEpicProps {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  deadline?: string;
}

export const createEpic = async (data: CreateEpicProps) => {
  const response = await fetch('/api/epics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create epic');
  }

  return result;
};
// Body :
// {
//   "title": "Epic 8888",
//   "description": "All design & implementation tasks",
//   "assignee_id": "31c7891a-15d4-46aa-94f8-db0fb5642e15",
//   "project_id": "298be621-59c7-4a62-ad2c-e640ff72135f",
//   "deadline": "2025-12-30"
// }
