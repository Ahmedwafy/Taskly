// src → services → updateEpics.ts

import { UpdateEpicArgs } from '@/types/shared';

export const updateEpicByID = async ({ epicId, payload }: UpdateEpicArgs) => {
  const response = await fetch(`/api/update-epic?epicId=${epicId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update epic.');
  }

  return response.json();
};
