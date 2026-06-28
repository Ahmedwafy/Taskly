// src → app → (pages) → projects → [projectId] → epics → new → page.tsx

import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import AddNewEpic from '@/app/components/pages/AddNewEpic';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface ProjectEpicsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function AndNewEpic({ params }: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);
  console.log(`projectId`, projectId);
  console.log(project.name);

  return (
    <main className="px-40 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <AddNewEpic />
    </main>
  );
}
