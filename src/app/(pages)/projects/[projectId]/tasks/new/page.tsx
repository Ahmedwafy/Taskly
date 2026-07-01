// src → app → (pages) → projects → [projectId] → tasks → new → page.tsx
import { redirect } from 'next/navigation';
import CreateNewTaskForm from '@/app/components/forms/CreateNewTaskForm';
import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import { fetchProjectById } from '@/app/queries/projects';
import { getAuthCookies } from '@/lib/auth';

interface CreateTaskPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function CreateNewTask({ params }: CreateTaskPageProps) {
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
    <main className="px-20 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <header className="flex flex-col gap-2 py-8">
        <h1 className="display-lg">Create New Task</h1>
        <p className="w-1/2 title-md text-gray-400">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </header>

      {/* Form receives the projectId directly as expected */}
      <CreateNewTaskForm projectId={projectId} />
    </main>
  );
}
