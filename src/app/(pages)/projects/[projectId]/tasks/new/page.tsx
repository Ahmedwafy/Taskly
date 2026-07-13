// src → app → (pages) → projects → [projectId] → tasks → new → page.tsx
import { redirect } from 'next/navigation';
import CreateNewTaskForm from '@/app/components/forms/CreateNewTaskForm';
import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import { fetchProjectById } from '@/app/queries/projects';
import { fetchProjectEpics } from '@/app/queries/epics'; // 1. Import your query function
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

  const [project, epicsData] = await Promise.all([
    fetchProjectById({ projectId, accessToken }),
    fetchProjectEpics({ projectId, limit: 1000, offset: 0, accessToken }), // Grabs all epics for dropdown selection
  ]);

  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <main className="px-20 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <header className="flex flex-col gap-2 py-8">
        <h1 className="title-style">Create New Task</h1>
        <p className="w-1/2 title-md text-gray-400">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </header>

      {/* 3. Pass the fetched epics straight into your form */}
      <CreateNewTaskForm
        projectId={projectId}
        initialEpics={epicsData?.projectEpics || []}
      />
    </main>
  );
}
