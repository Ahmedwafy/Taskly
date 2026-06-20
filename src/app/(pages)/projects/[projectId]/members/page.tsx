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
    <div>
      <ProjectMambersPage projectName={project.name} />
    </div>
  );
}
