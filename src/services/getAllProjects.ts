// // src/services/getAllProjects.ts

// Call Only In --- Client Components ---
export const getAllProjects = async (params: {
  limit: number;
  offset: number;
}) => {
  const response = await fetch(
    `/api/get-all-projects?limit=${params.limit}&offset=${params.offset}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch projects');
  }

  return data;
};
