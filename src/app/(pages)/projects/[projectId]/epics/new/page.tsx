// src → app → (pages) → projects → [projectId] → epics → new → page.tsx
import { redirect } from 'next/navigation';
import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import AddNewEpic from '@/app/components/pages/AddNewEpic';
import { fetchProjectById } from '@/app/queries/projects';
import { getAuthCookies } from '@/lib/auth';

interface ProjectEpicsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function AddNewEpicPage({
  params,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const project = await fetchProjectById({
    projectId,
    accessToken,
  });

  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <main className="px-40 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <AddNewEpic />
    </main>
  );
}
