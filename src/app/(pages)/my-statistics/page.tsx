// src > app > (pages) > my-statistics > page.tsx

import MyStatisticsPage from '@/app/components/pages/MyStatistics';
import { fetchAllProjects } from '@/app/queries/projects';
import { getAuthCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function My_Statistics() {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const projects = await fetchAllProjects({ accessToken });

  return (
    <div className="bg-background h-full">
      <MyStatisticsPage projects={projects} />
    </div>
  );
}
