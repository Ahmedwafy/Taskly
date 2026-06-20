// src/app/(pages)/projects/[projectId]/epics/page.tsx

import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import AddNewEpic from '@/app/components/pages/AddNewEpic';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface ProjectEpicsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectEpicsPage({
  params,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);
  console.log(`projectId`, projectId);
  console.log(project.name);

  return (
    <div className="px-40 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <AddNewEpic />
    </div>
  );
}
// 871e33a1-8804-4bc5-95bf-ab2e8e246d20
