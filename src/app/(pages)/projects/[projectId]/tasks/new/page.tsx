// src > app > (pages) > projects > [projectId] > tasks > new > page.tsx
import { redirect } from 'next/navigation';
import CreateNewTaskForm from '@/app/components/forms/CreateNewTaskForm';
import Breadcrumb from '@/app/components/organisms/Breadcrumb';
import { fetchProjectById } from '@/app/queries/projects';
import { fetchProjectEpics } from '@/app/queries/epics';
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

  // 1. Fetch project details & initial epics in parallel
  const [projectResult, epicsResult] = await Promise.allSettled([
    fetchProjectById({ projectId, accessToken }),
    fetchProjectEpics({
      projectId,
      limit: 10, // Strictly enforced pagination limit : was 1000
      offset: 0,
      accessToken,
    }),
  ]);

  // 2. Extract values safely
  const project =
    projectResult.status === 'fulfilled' ? projectResult.value : null;

  // const initialEpics =
  //   epicsResult.status === 'fulfilled'
  //     ? epicsResult.value?.projectEpics || []
  //     : [];

  // Log non-critical fetch errors for debugging
  if (epicsResult.status === 'rejected') {
    console.error('Failed to pre-fetch epics:', epicsResult.reason);
  }

  // 3. Fail gracefully if critical project data is missing
  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <div className="px-5 sm:px-20 py-10 max-w-400 mx-auto">
      <Breadcrumb projectName={project.name} />
      <header className="flex flex-col gap-2 py-8 w-full">
        <h1 className="title-style">Create New Task</h1>
        <p className="w-full title-desc-style">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </header>

      {/* <CreateNewTaskForm projectId={projectId} initialEpics={initialEpics} /> */}
      <CreateNewTaskForm projectId={projectId} accessToken={accessToken} />
    </div>
  );
}
