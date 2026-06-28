// src → services → createEpics.ts

export interface CreateEpicProps {
  title: string;
  project_id: string;
  description?: string;
  assignee_id?: string;
  deadline?: string;
}

export const createEpic = async (data: CreateEpicProps) => {
  const payload = {
    title: data.title.trim(),
    project_id: data.project_id.trim(),
    description: data.description?.trim() || null,
    assignee_id: data.assignee_id?.trim() || null,

    // If deadline is empty or just spaces, set it to null so the DB accepts it
    deadline: data.deadline?.trim() ? data.deadline.trim() : null,
  };

  const response = await fetch('/api/create-epic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

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
    throw new Error(res?.message || 'Failed to create project');
  }

  return res;
};
