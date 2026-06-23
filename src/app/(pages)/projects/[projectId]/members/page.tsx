// src/app/(pages)/projects/[projectId]/members/page.tsx
import ProjectMambersPage from '@/app/components/pages/ProjectMambersPage';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface ProjectMembersPageProps {
  params: Promise<{
    projectId: string;
  }>;
}
export default async function ProjectMembers({
  params,
}: ProjectMembersPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);
  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full">
      <ProjectMambersPage projectName={project.name} />
    </div>
  );
}
