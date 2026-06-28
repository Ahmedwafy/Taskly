// src/services/createNewTask.ts

interface CreateNewTaskProps {
  title: string;
  project_id: string;
  epic_id?: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status?: string;
}

export const createNewTask = async (data: CreateNewTaskProps) => {
  // Convert empty strings to null so PostgreSQL handles foreign keys and dates correctly
  const payload = {
    title: data.title.trim(),
    project_id: data.project_id,
    assignee_id: data.assignee_id || null,
    epic_id: data.epic_id || null,
    description: data.description?.trim() || null,
    due_date: data.due_date || null,
    status: data.status || 'TO_DO',
  };

  const response = await fetch(`/api/create-new-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData?.message || 'Failed to create task');
  }

  return responseData;
};
