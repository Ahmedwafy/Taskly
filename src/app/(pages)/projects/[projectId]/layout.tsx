// src/app/(pages)/projects/[projectId]/layout.tsx
import ProjectSidebar from '@/app/components/ProjectSidebar';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex">
      <ProjectSidebar projectId={projectId} />

      <div className="flex-1">{children}</div>
    </div>
  );
}
