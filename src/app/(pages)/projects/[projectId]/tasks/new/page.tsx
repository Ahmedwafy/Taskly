// src → app → (pages) → projects → [projectId] → tasks → new → page.tsx
import CreateNewTaskForm from '@/app/components/forms/CreateNewTaskForm';
import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface CreateTaskPageProps {
  params: Promise<{
    projectId: string;
  }>;
}
export default async function CreateNewTask({ params }: CreateTaskPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);

  return (
    <main className="px-20 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <header className="flex flex-col gap-2 py-8">
        <h1 className="display-lg">Create New Task</h1>
        <p className="w-1/2 title-md text-gray-400">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </header>
      {/*  */}
      {/* --- Form --- */}
      <CreateNewTaskForm projectId={projectId} />
    </main>
  );
}
