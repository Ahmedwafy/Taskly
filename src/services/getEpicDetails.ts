// src → services → getEpicDetails.ts
// Call Only In --- Client Components ---

interface GetEpicDetailsParams {
  projectId: string;
  epicId: string;
}

export const getEpicDetails = async ({
  projectId,
  epicId,
}: GetEpicDetailsParams) => {
  // Corrected the path to match your route directory and added epicId
  const res = await fetch(
    `/api/get-epic-details?projectId=${projectId}&epicId=${epicId}`,
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch epic details');
  }

  // Reminder: The requirement states the API response is an array -> use the first item.
  // We handle extracting the first item here or in the component. Let's do it here for clean component code:
  return Array.isArray(data) ? data[0] : data;
};

// Client Component
//       │
//       ▼
// getEpicDetails()
//       │
//       ▼
// /api/get-epics-details
//       │
//       ▼
// fetchPEpicDetails()
//       │
//       ▼
// Supabase / Backend
